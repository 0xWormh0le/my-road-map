import datetime

from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_extensions.mixins import NestedViewSetMixin

from api.filters import AssessmentFilter
from api.permissions import (
    ApprovedUserPermission, UserCompanyAllowSpecificCoachesForSpecificRoadmapsPermission,
    UserCompanyHasCompetencyNotesJournalEnabledPermission, AdminOrReadOnlyObjectPermission,
    UserCompanySameAsObjectCompanyOrReadOnlyPermission, AdminCoachOrCohortAdminPermission,
    AdminOrCoachSpecificOrReadOnlyCompetencyPermission,
)
from api.serializers import (
    DefaultRoadmapSerializer, RoadmapStageSerializer, RoadmapStageCompetencySerializer,
    RoadmapStageCompetencyCommentSerializer, RoadmapStageCompetencyGlobalActionItemSerializer,
    RoadmapStageCompetencyAssessmentSerializer, RoadmapStageCompetencyActionItemAssessmentSerializer,
    AssignedRoadmapSerializer, AssignedCoachSerializer, RoadmapStageCompetencyNoteSerializer, StudentActionSerializer,
    RoadmapStageCompetencyGlobalQuestionSerializer, RoadmapStageCompetencyQuestionAnswerSerializer,
)
from api.shared import (
    prepare_roadmap_stages_queryset, prepare_stage_competencies_queryset, get_assigned_coaches_qs, get_student_from_query,
)
from api.views.shared import (
    AttachmentsManagementViewSetMixin, UserRoadmapsMixin, copy_object, reorder_objects, bulk_assign,
)
from dashboard.models import (
    Roadmap, Stage, Competency, Comment, ActionItemGlobal, User, Assessment, ActionItemAssessment, RoadmapAssignment,
    AssignedRoadmap, Note, Cohort, QuestionGlobal, QuestionAnswer,
)
from dashboard.views import (
    notify_about_new_comment, notify_about_student_activity, copy_roadmap, copy_stage, copy_competency, get_action_items
)
from notifications.models import Notification
from notifications.signals import notify


class RoadmapsViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    This is roadmaps API endpoint.
    """
    serializer_class = DefaultRoadmapSerializer
    permission_classes = (
        IsAuthenticated, ApprovedUserPermission, AdminOrReadOnlyObjectPermission,
        UserCompanySameAsObjectCompanyOrReadOnlyPermission,
    )
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ['title']
    search_fields = ['title', 'description']

    def get_queryset(self):
        current_user = self.request.user
        student_qs = current_user.roadmaps.prefetch_related('stage_set').filter(company=current_user.company)
        if 'asStudent' in self.request.query_params:
            qs = student_qs
        elif current_user.is_superuser:
            qs = Roadmap.objects
        elif current_user.is_admin() or current_user.is_coach():
            qs = Roadmap.objects.filter(company=current_user.company)
        else:
            qs = student_qs
        return qs.order_by('id')

    def perform_create(self, serializer):
        current_user = self.request.user
        with transaction.atomic():
            roadmap = serializer.save(company=current_user.company)
            Stage.objects.create(title='Untitled Stage', roadmap=roadmap, order=0)

    @action(detail=True, methods=['post'], url_path='copy-roadmap')
    def copy_roadmap(self, request, **kwargs):
        return copy_object(self, Roadmap, copy_roadmap)

    @action(detail=True, methods=['post'], url_path='clear-assessments')
    def clear_assessments(self, request, **kwargs):
        roadmap = get_object_or_404(Roadmap, pk=self.kwargs['pk'])
        roadmap_assignments_qs = Assessment.objects.filter(competency__stage__roadmap=roadmap).distinct()
        roadmap_competency_ids = roadmap_assignments_qs.values_list('competency_id', flat=True)
        roadmap_student_ids = roadmap_assignments_qs.values_list('student_id', flat=True)
        assessments_to_create = []
        for competency_id in roadmap_competency_ids:
            for student_id in roadmap_student_ids:
                last_assessment = Assessment.objects.filter(
                    competency__stage__roadmap=roadmap, student=student_id, competency=competency_id).order_by('-id')
                if last_assessment.status != Assessment.GREY:
                    assessments_to_create.append(Assessment(
                        student=last_assessment.student,
                        user=last_assessment.student,
                        competency=last_assessment.competency,
                        status=Assessment.GREY,
                        date=datetime.date.today(),
                        comment='',
                        approved=True,
                    ))
        Assessment.objects.bulk_create(assessments_to_create)
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='reorder-stages')
    def reorder_stages(self, request, **kwargs):
        return reorder_objects(self, request, Roadmap, lambda r: r.stage_set.all())

    # TODO: Add custom serializer for better input validation & Browseable API support
    @action(detail=True, methods=['post'], url_path='bulk-assign-cohorts')
    def bulk_assign_cohorts(self, request, **kwargs):
        current_user = self.request.user
        if not current_user.company.group_specific_roadmaps:
            raise PermissionDenied("Current user company doesn't allow assigning cohorts to roadmaps")

        roadmap = get_object_or_404(Roadmap, pk=self.kwargs['pk'])

        def assign_cohort(cohort):
            roadmap.cohorts.add(cohort)
            cohort.roadmaps.add(roadmap)

        def unassign_cohort(cohort):
            roadmap.cohorts.remove(cohort)
            cohort.roadmaps.remove(roadmap)

        return bulk_assign(
            request,
            'cohorts',
            lambda: roadmap.cohorts.all().values_list('pk', flat=True),
            Cohort.objects.filter(company=current_user.company),
            assign_cohort,
            unassign_cohort,
        )


class RoadmapStagesViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    This is roadmap stages API endpoint.
    """
    queryset = Stage.objects.select_related('roadmap').order_by('id')
    serializer_class = RoadmapStageSerializer
    permission_classes = (IsAuthenticated, ApprovedUserPermission, AdminOrReadOnlyObjectPermission)

    def get_queryset(self):
        qs = super().get_queryset()
        return prepare_roadmap_stages_queryset(qs, self.request.user)

    def perform_create(self, serializer):
        roadmap = get_object_or_404(Roadmap, pk=self.kwargs['parent_lookup_roadmap'])
        last_stage_by_order = Stage.objects.filter(roadmap=roadmap).order_by('-order').first()
        next_stage_order = last_stage_by_order.order + 1 if last_stage_by_order else 1
        serializer.save(roadmap=roadmap, order=next_stage_order)

    @action(detail=True, methods=['post'], url_path='copy-stage')
    def copy_stage(self, request, **kwargs):
        return copy_object(self, Stage, copy_stage)

    @action(detail=True, methods=['post'], url_path='reorder-competencies')
    def reorder_competencies(self, request, **kwargs):
        return reorder_objects(self, request, Stage, lambda s: s.competency_set.filter(user_defined=False).all())


class RoadmapStageCompetenciesViewSet(NestedViewSetMixin, AttachmentsManagementViewSetMixin, viewsets.ModelViewSet):
    """
    This is roadmap stage competencies API endpoint.

    Specify "?details=attachments" query parameter to get detailed attachments data.
    """
    queryset = Competency.objects.select_related('stage', 'stage__roadmap').order_by('id')
    serializer_class = RoadmapStageCompetencySerializer
    permission_classes = (IsAuthenticated, ApprovedUserPermission, AdminOrCoachSpecificOrReadOnlyCompetencyPermission)

    def get_queryset(self):
        qs = super().get_queryset()
        student = get_student_from_query(self.request)
        return prepare_stage_competencies_queryset(qs, self.request.user, student)

    def get_serializer_save_kwargs(self):
        result = super().get_serializer_save_kwargs()
        competency = get_object_or_404(Competency, pk=self.kwargs['pk'])
        result['competency'] = competency
        return result

    def on_missing_attachment_user(self, result):
        current_user = self.request.user
        if current_user.is_coach():
            competency = get_object_or_404(Competency, pk=self.kwargs['pk'])
            if competency.user_defined and competency.student in current_user.students.all():
                # In this case it's the same as a global attachment
                return result
        super().on_missing_attachment_user(result)

    def perform_create(self, serializer):
        current_user = self.request.user
        stage = get_object_or_404(Stage, pk=self.kwargs['parent_lookup_stage'])
        save_kwargs = {}
        student_of_competency = serializer.validated_data.get('student')
        if student_of_competency:
            save_kwargs['user_defined'] = True
        else:
            last_compentency_by_order = Competency.objects.filter(stage=stage).order_by('order').last()
            save_kwargs['order'] = last_compentency_by_order.order + 1 if last_compentency_by_order else 1
        serializer.save(
            stage=stage,
            description='',
            red_description=current_user.company.default_red_assessment,
            yellow_description=current_user.company.default_yellow_assessment,
            green_description=current_user.company.default_green_assessment,
            **save_kwargs,
        )
        if student_of_competency:
            notify.send(current_user, recipient=student_of_competency, verb=Notification.NEW_COMPETENCY,
                        target=serializer.instance)

    @action(detail=True, methods=['post'], url_path='copy-competency')
    def copy_competency(self, request, **kwargs):
        return copy_object(self, Competency, copy_competency)

    @action(detail=True, methods=['post'], url_path='hide-from-student', serializer_class=StudentActionSerializer,
            permission_classes=[IsAuthenticated, AdminCoachOrCohortAdminPermission])
    def hide_from_student(self, request, **kwargs):
        return self._hide_unhide_competency_for_student(request, lambda c, s: c.hidden_for.add(s))

    @action(detail=True, methods=['post'], url_path='unhide-from-student', serializer_class=StudentActionSerializer,
            permission_classes=[IsAuthenticated, AdminCoachOrCohortAdminPermission])
    def unhide_from_student(self, request, **kwargs):
        return self._hide_unhide_competency_for_student(request, lambda c, s: c.hidden_for.remove(s))

    @action(detail=True, methods=['post'], url_path='reorder-questions')
    def reorder_questions(self, request, **kwargs):
        return reorder_objects(self, request, Competency, lambda s: s.questionglobal_set.all())

    @action(detail=True, methods=['post'], url_path='reorder-action-items')
    def reorder_action_items(self, request, **kwargs):
        return reorder_objects(self, request, Competency, lambda s: s.actionitemglobal_set.all())

    def _hide_unhide_competency_for_student(self, request, hide_unhide_impl):
        current_user = self.request.user
        if not current_user.company.coach_admin_edit_visibility_user_objectives:
            raise PermissionDenied(
                "Current user company doesn't allow hiding/unhiding of competencies on per user basis")
        competency = get_object_or_404(Competency, pk=self.kwargs['pk'])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hide_unhide_impl(competency, serializer.validated_data.get('student'))
        return Response(status=status.HTTP_200_OK)


class RoadmapStageCompetencyCommentsViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    This is roadmap stage competency comments API endpoint.
    """
    queryset = Comment.objects.select_related(
        'competency', 'competency__stage', 'competency__stage__roadmap').order_by('id')
    serializer_class = RoadmapStageCompetencyCommentSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['id', 'date']
    filterset_fields = ['student']

    def get_queryset(self):
        qs = super().get_queryset()
        current_user = self.request.user
        if current_user.is_superuser:
            pass  # Keep qs as is
        elif current_user.is_admin():
            qs = qs.filter(student__company=current_user.company)
        elif current_user.is_coach():
            qs = qs.filter(student__in=current_user.students.all())
        else:
            qs = qs.filter(student=current_user)
        return qs

    def perform_create(self, serializer):
        comment = serializer.save()
        notify_about_new_comment(comment)


class RoadmapStageCompetencyGlobalActionItemsViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    This is roadmap stage competency global action items API endpoint.
    """
    queryset = ActionItemGlobal.objects.select_related(
        'competency', 'competency__stage', 'competency__stage__roadmap').order_by('id')
    serializer_class = RoadmapStageCompetencyGlobalActionItemSerializer
    permission_classes = (IsAuthenticated, ApprovedUserPermission, AdminOrCoachSpecificOrReadOnlyCompetencyPermission)

    def get_queryset(self):
        qs = super().get_queryset()
        current_user = self.request.user
        if current_user.is_superuser:
            pass  # Keep qs as is
        elif current_user.is_admin() or current_user.is_coach():
            qs = qs.filter(competency__stage__roadmap__company=current_user.company)
        else:
            qs = qs.filter(competency__stage__roadmap__in=current_user.roadmaps.values_list('pk', flat=True))
        return qs

    def perform_create(self, serializer):
        competency = get_object_or_404(Competency, pk=self.kwargs['parent_lookup_competency'])
        serializer.save(competency=competency)
        # Due to the way default value is set for date_created we run into DRF assertion on DateField.to_representation
        serializer.instance.date_created = serializer.instance.date_created.date()


class RoadmapStageCompetencyAssessmentsViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    This is roadmap stage competency assessments API endpoint.
    """
    queryset = Assessment.objects.select_related(
        'competency', 'competency__stage', 'competency__stage__roadmap').order_by('id')
    serializer_class = RoadmapStageCompetencyAssessmentSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['pk']
    filterset_class = AssessmentFilter

    def get_queryset(self):
        qs = super().get_queryset()
        current_user = self.request.user
        if current_user.is_superuser:
            pass  # Keep qs as is
        elif current_user.is_admin():
            qs = qs.filter(student__company=current_user.company)
        elif current_user.is_coach():
            qs = qs.filter(student__in=current_user.students.all())
        else:
            qs = qs.filter(student=current_user)
        return qs

    def perform_create(self, serializer):
        current_user = self.request.user
        student = serializer.validated_data.get('student')
        if not student:
            if current_user.is_student():
                student = current_user
            else:
                raise ValidationError({'student': 'This field is required in this case'})
        coach_or_admin_created_assessment = False
        if student != current_user:
            if not (current_user.is_coach() or current_user.is_admin()) or \
                    not current_user.company.coaches_admin_can_assess_objectives:
                raise PermissionDenied("Current user can't create assessments for other users")
            coach_or_admin_created_assessment = True
        competency = get_object_or_404(Competency, pk=self.kwargs['parent_lookup_competency'])
        slider_status = serializer.validated_data.get('slider_status')
        save_kwargs = {'student': student, 'competency': competency, 'user': current_user}
        if slider_status:
            if slider_status < 3.5:
                status_override = '1'
            elif 3.5 <= slider_status < 7.5:
                status_override = '2'
            else:
                status_override = '3'
            save_kwargs['status'] = status_override
        with transaction.atomic():
            assessment = serializer.save(**save_kwargs)
            if assessment.status == Assessment.GREEN and assessment.approved and \
                    current_user.company.coaches_approve_green_assessments:
                assessment.approved = False
                assessment.save()
        if assessment.status == Assessment.GREEN and not assessment.approved and not coach_or_admin_created_assessment:
            notify_about_student_activity(current_user, assessment.student, assessment.competency.roadmap,
                                          verb=Notification.NEEDS_APPROVAL, target=assessment.competency)

    @action(detail=True, methods=['post'], url_path='approve-assessment')
    def approve_assessment(self, request, **kwargs):
        assessment = get_object_or_404(Assessment, pk=self.kwargs['pk'])
        assessment.approved = True
        assessment.rejected = False
        assessment.reviewer = request.user
        assessment.review_date = timezone.now()
        assessment.save()
        notify.send(request.user, recipient=assessment.student, verb=Notification.APPROVED,
                    target=assessment.competency)
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='reject-assessment')
    def reject_assessment(self, request, **kwargs):
        assessment = get_object_or_404(Assessment, pk=self.kwargs['pk'])
        assessment.rejected = True
        assessment.approved = False
        assessment.reviewer = request.user
        assessment.review_date = timezone.now()
        assessment.save()
        notify.send(request.user, recipient=assessment.student, verb=Notification.NEEDS_WORK,
                    target=assessment.competency)
        return Response(status=status.HTTP_200_OK)


class RoadmapStageCompetencyActionItemAssessmentsViewSet(
    NestedViewSetMixin, AttachmentsManagementViewSetMixin, viewsets.ModelViewSet
):
    """
    This is roadmap stage competency action item assessments API endpoint.

    Specify "?details=attachments" query parameter to get detailed attachments data.
    """
    queryset = ActionItemAssessment.objects.select_related(
        'competency', 'competency__stage', 'competency__stage__roadmap', 'parent').order_by('id')
    serializer_class = RoadmapStageCompetencyActionItemAssessmentSerializer
    filterset_fields = ['student']

    def get_queryset(self):
        qs = super().get_queryset()
        current_user = self.request.user
        competency_id = self.kwargs['parent_lookup_competency']
        student_id = self.request.query_params.get('student')
        student = None
        if student_id:
            student = User.objects.get(pk=student_id)
        elif current_user and current_user.is_student():
            student = current_user
        if student:
            # This pre-creates action items needed
            get_action_items(student, competency_id)
        if current_user.is_admin():
            qs = qs.filter(student__company=current_user.company)
        elif current_user.is_coach():
            qs = qs.filter(Q(student__in=current_user.students.all()) | Q(student=current_user))
        else:
            qs = qs.filter(student=current_user, archived=False)
        return qs

    def get_serializer(self, *args, **kwargs):
        # This condition corresponds to new instance creation only
        if 'data' in kwargs and 'partial' not in kwargs:
            current_user = self.request.user
            request_data = kwargs['data']
            if 'student' not in request_data:
                request_data['student'] = current_user.pk
            if 'competency' not in request_data and 'parent_lookup_competency' in self.kwargs:
                request_data['competency'] = self.kwargs['parent_lookup_competency']
        return super().get_serializer(*args, **kwargs)

    def get_serializer_save_kwargs(self):
        result = super().get_serializer_save_kwargs()
        competency = get_object_or_404(Competency, pk=self.kwargs['parent_lookup_competency'])
        action_item = get_object_or_404(ActionItemAssessment, pk=self.kwargs['pk'])
        result.update({
            'competency': competency,
            'actionItem': action_item,
        })
        return result

    def perform_create(self, serializer):
        current_user = self.request.user
        super().perform_create(serializer)
        ai = serializer.instance
        if current_user != ai.student:
            notify.send(current_user, recipient=ai.student, verb=Notification.NEW_ACTION_ITEM, target=ai.competency)

    def perform_update(self, serializer):
        current_user = self.request.user
        old_notes = serializer.instance.notes
        old_marked_done = serializer.instance.marked_done
        super().perform_update(serializer)
        updated_ai = serializer.instance
        if old_notes != updated_ai.notes:
            notify_about_student_activity(current_user, updated_ai.student, updated_ai.competency.roadmap,
                                          verb=Notification.AI_RESPONSE_UPDATED, target=updated_ai.competency)
        if updated_ai.marked_done and not old_marked_done:
            if updated_ai.parent and 'requires_approval' not in updated_ai.parent.resolutions:
                updated_ai.approved_done = True
                updated_ai.date_approved_done = datetime.date.today()
                updated_ai.save()
            else:
                notify_about_student_activity(current_user, updated_ai.student, updated_ai.competency.roadmap,
                                              verb=Notification.AI_NEEDS_APPROVAL, target=updated_ai.competency)

    @action(detail=True, methods=['post'], url_path='approve-ai')
    def approve_ai(self, request, **kwargs):
        ai = get_object_or_404(ActionItemAssessment, pk=self.kwargs['pk'])
        ai.date_approved_done = datetime.date.today()
        ai.approved_done = True
        ai.save()
        self._mark_ai_needs_approval_notifications_read(ai)
        notify.send(request.user, recipient=ai.student, verb=Notification.AI_APPROVED, target=ai.competency)
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='reject-ai')
    def reject_ai(self, request, **kwargs):
        ai = get_object_or_404(ActionItemAssessment, pk=self.kwargs['pk'])
        ai.approved_done = False
        ai.date_approved_done = None
        ai.save()
        self._mark_ai_needs_approval_notifications_read(ai)
        return Response(status=status.HTTP_200_OK)

    def _mark_ai_needs_approval_notifications_read(self, ai):
        Notification.objects.all_unread(self.request.user).\
            filter(verb=Notification.AI_NEEDS_APPROVAL, target_object_id=ai.competency.id).\
            update(read=True)


class AssignedRoadmapsViewSet(
    UserRoadmapsMixin, NestedViewSetMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = AssignedRoadmapSerializer

    def get_queryset(self):
        return self.get_assigned_roadmaps()

    def perform_create(self, serializer):
        roadmap = Roadmap.objects.get(pk=serializer.validated_data.get('roadmap_id'))
        self._assign_roadmap(roadmap)

    def perform_destroy(self, roadmap):
        self._unassign_roadmap(roadmap)

    # TODO: Add custom serializer for better input validation & Browseable API support
    @action(detail=False, methods=['post'], url_path='bulk-assign')
    def bulk_assign_roadmaps(self, request, **kwargs):
        return bulk_assign(
            request,
            'roadmaps',
            lambda: self.get_assigned_roadmaps().values_list('pk', flat=True),
            Roadmap.objects.filter(company=self.request.user.company),
            self._assign_roadmap,
            self._unassign_roadmap,
        )

    def _get_roadmap_for_action(self):
        roadmap_id = self.request.data.get('roadmap_id')
        try:
            return Roadmap.objects.get(pk=roadmap_id)
        except Roadmap.DoesNotExist:
            raise ValidationError({'roadmap_id': f'Roadmap with ID {roadmap_id} not found'})

    def _get_coach_for_action(self):
        coach_id = self.request.data.get('coach_id')
        try:
            return User.objects.get(pk=coach_id)
        except User.DoesNotExist:
            raise ValidationError({'coach_id': f'Coach with ID {coach_id} not found'})

    def _assign_roadmap(self, roadmap):
        self._ensure_assign_unassign_permissions()
        student = self.get_student()
        student.roadmaps.add(roadmap)
        update_roadmap_assignment = \
            self.request.user.company.archive_roadmaps and not student.archived_roadmaps.filter(pk=roadmap.id).exists()
        student.archived_roadmaps.remove(roadmap)
        if update_roadmap_assignment:
            try:
                previous_date_assigned = RoadmapAssignment.objects.get(user=student, roadmap=roadmap)
                previous_date_assigned.delete()
            except RoadmapAssignment.DoesNotExist:
                pass
            RoadmapAssignment.objects.create(user=student, roadmap=roadmap, date_assigned=timezone.now())

    def _unassign_roadmap(self, roadmap):
        if roadmap.assign_to_all_users:
            raise PermissionDenied(f"Roadmap with ID '{roadmap.id}' is assigned to all users and cannot be unassigned")
        self._ensure_assign_unassign_permissions()
        student = self.get_student()
        student.roadmaps.remove(roadmap)
        if self.request.user.company.archive_roadmaps:
            student.archived_roadmaps.add(roadmap)

    def _ensure_assign_unassign_permissions(self):
        current_user = self.request.user
        if current_user.is_superuser:
            return  # Superuser can do anything
        student = self.get_student()
        if current_user.is_admin() and student.company == current_user.company:
            return  # Admin can update assigned roadmaps of students in own company
        if current_user.is_cohort_admin() and \
                student.cohort.filter(pk__in=current_user.cohort.values_list('pk', flat=True)).exists():
            return  # Cohort admin can update assigned roadmaps of students of own cohorts
        if current_user.is_coach() and current_user.students.filter(pk=student.id).exists() and \
                current_user.company.coach_can_asssign_roadmaps:
            return  # Admin can update assigned roadmaps of own students if allowed by company
        if current_user.is_student() and current_user == student and current_user.company.user_can_asssign_roadmaps:
            return  # Student can update own assigned roadmaps if allowed by company
        raise PermissionDenied(f"Current user can't update assigned roadmaps of the student with ID={student.id}")


class ArchivedRoadmapsViewSet(UserRoadmapsMixin, NestedViewSetMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = AssignedRoadmapSerializer

    def get_queryset(self):
        return self.get_archived_roadmaps()


class AvailableRoadmapsViewSet(UserRoadmapsMixin, NestedViewSetMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = AssignedRoadmapSerializer

    def get_queryset(self):
        current_user = self.request.user
        student = self.get_student()
        roadmaps = self.get_assigned_roadmaps()
        archived_roadmaps = self.get_archived_roadmaps()
        student_cohorts = student.cohort.all()
        if not student_cohorts:
            student_cohort_roadmaps = roadmaps
        else:
            student_cohort_roadmaps = Roadmap.objects.none()
            for cohort in student_cohorts:
                student_cohort_roadmaps = \
                    student_cohort_roadmaps.union(cohort.roadmaps.filter(company=current_user.company))
        roadmap_templates = self._exclude_assigned_and_archived_roadmaps(
            Roadmap.objects.order_by('title').filter(company=current_user.company), roadmaps, archived_roadmaps)
        total = Roadmap.objects.none()
        if roadmap_templates.count() > 0:
            company_unassigned_roadmaps = Roadmap.objects.filter(company=current_user.company, cohorts=None)
            combine = company_unassigned_roadmaps | student_cohort_roadmaps
            total = self._exclude_assigned_and_archived_roadmaps(
                combine.distinct().filter(is_published=True), roadmaps, archived_roadmaps)
        return total

    def _exclude_assigned_and_archived_roadmaps(self, qs, assigned_roadmaps, archived_roadmaps):
        current_user = self.request.user
        qs = qs.exclude(id__in=[r.id for r in assigned_roadmaps])
        if current_user.company.archive_roadmaps:
            qs = qs.exclude(id__in=[r.id for r in archived_roadmaps])
        return qs


class AssignedCoachesViewSet(
    NestedViewSetMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = AssignedCoachSerializer
    permission_classes = [
        IsAuthenticated, ApprovedUserPermission, UserCompanyAllowSpecificCoachesForSpecificRoadmapsPermission,
    ]

    def get_queryset(self):
        return get_assigned_coaches_qs(self.request.user, self._get_roadmap())

    def perform_create(self, serializer):
        coach = get_object_or_404(User, pk=serializer.validated_data.get('coach_id'), groups__name="Coach")
        self._assign_coach(coach)
        serializer.instance = coach

    def perform_destroy(self, coach):
        self._unassign_coach(coach)

    # TODO: Add custom serializer for better input validation & Browseable API support
    @action(detail=False, methods=['post'], url_path='bulk-assign')
    def bulk_assign_coaches(self, request, **kwargs):
        current_user = self.request.user
        return bulk_assign(
            request,
            'coaches',
            lambda: map(lambda ar: ar.coach.id, current_user.get_current_assigned_roadmaps()),
            User.objects.filter(groups__name="Coach", company=current_user.company, students=current_user),
            self._assign_coach,
            self._unassign_coach,
        )

    def _get_roadmap(self):
        return get_object_or_404(Roadmap, pk=self.kwargs['parent_lookup_roadmap'])

    def _assign_coach(self, coach):
        current_user = self.request.user
        roadmap = self._get_roadmap()
        assigned_roadmap = AssignedRoadmap.objects.filter(roadmap=roadmap, student=current_user, coach=coach).first()
        if not assigned_roadmap:
            assigned_roadmap = AssignedRoadmap.objects.create(roadmap=roadmap, student=current_user, coach=coach)
        current_user.assigned_roadmaps.add(assigned_roadmap)

    def _unassign_coach(self, coach):
        current_user = self.request.user
        roadmap = self._get_roadmap()
        assigned_roadmap = AssignedRoadmap.objects.filter(roadmap=roadmap, student=current_user, coach=coach).first()
        if assigned_roadmap:
            assigned_roadmap.delete()


class AvailableCoachesViewSet(NestedViewSetMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = AssignedCoachSerializer
    permission_classes = [
        IsAuthenticated, ApprovedUserPermission, UserCompanyAllowSpecificCoachesForSpecificRoadmapsPermission,
    ]

    def get_queryset(self):
        current_user = self.request.user
        if not current_user.company.users_can_assign_specific_coaches_for_specific_roadmaps:
            return User.objects.none()
        roadmap = get_object_or_404(Roadmap, pk=self.kwargs['parent_lookup_roadmap'])
        existing_coaches_ids = AssignedRoadmap.objects.filter(
            student=current_user, roadmap=roadmap).values_list('coach_id', flat=True)
        return User.objects.filter(groups__name="Coach", company=current_user.company, students=current_user).exclude(
            pk__in=existing_coaches_ids).distinct().order_by('id')


class RoadmapStageCompetencyNotesViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    This is roadmap stage competency notes API endpoint.
    """
    queryset = Note.objects.select_related(
        'competency', 'competency__stage', 'competency__stage__roadmap').order_by('id')
    serializer_class = RoadmapStageCompetencyNoteSerializer
    permission_classes = [
        IsAuthenticated, ApprovedUserPermission, UserCompanyHasCompetencyNotesJournalEnabledPermission,
    ]
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['pk']
    filterset_fields = ['student']

    def get_queryset(self):
        qs = super().get_queryset()
        current_user = self.request.user
        if current_user.is_superuser:
            pass  # Keep qs as is
        elif current_user.is_admin():
            qs = qs.filter(student__company=current_user.company)
        elif current_user.is_coach():
            qs = qs.filter(student__in=current_user.students.all())
        else:
            qs = qs.filter(student=current_user)
        return qs

    def perform_create(self, serializer):
        current_user = self.request.user
        if not current_user.is_student():
            raise PermissionDenied("Only students can create notes")
        competency = get_object_or_404(Competency, pk=self.kwargs['parent_lookup_competency'])
        serializer.save(student=current_user, competency=competency)

    def perform_update(self, serializer):
        current_user = self.request.user
        if current_user != serializer.instance.student:
            raise PermissionDenied("Only author can edit own notes")
        competency = get_object_or_404(Competency, pk=self.kwargs['parent_lookup_competency'])
        serializer.save(student=current_user, competency=competency)


class RoadmapStageCompetencyGlobalQuestionsViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    This is roadmap stage competency global questions API endpoint.
    """
    queryset = QuestionGlobal.objects.select_related(
        'competency', 'competency__stage', 'competency__stage__roadmap').order_by('order', 'id')
    serializer_class = RoadmapStageCompetencyGlobalQuestionSerializer
    permission_classes = (IsAuthenticated, ApprovedUserPermission, AdminOrCoachSpecificOrReadOnlyCompetencyPermission)

    def get_queryset(self):
        qs = super().get_queryset()
        current_user = self.request.user
        if current_user.is_superuser:
            pass  # Keep qs as is
        elif current_user.is_admin() or current_user.is_coach():
            qs = qs.filter(competency__stage__roadmap__company=current_user.company)
        else:
            qs = qs.filter(competency__stage__roadmap__in=current_user.roadmaps.values_list('pk', flat=True))
        return qs

    def perform_create(self, serializer):
        competency = get_object_or_404(Competency, pk=self.kwargs['parent_lookup_competency'])
        serializer.save(competency=competency)


class RoadmapStageCompetencyQuestionAnswersViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    This is roadmap stage competency question answers API endpoint.
    """
    queryset = QuestionAnswer.objects.select_related(
        'competency', 'competency__stage', 'competency__stage__roadmap', 'parent').order_by('id')
    serializer_class = RoadmapStageCompetencyQuestionAnswerSerializer
    filterset_fields = ['student']

    def get_queryset(self):
        qs = super().get_queryset()
        current_user = self.request.user
        if current_user.is_superuser:
            pass  # Keep qs as is
        elif current_user.is_admin():
            qs = qs.filter(student__company=current_user.company)
        elif current_user.is_coach():
            qs = qs.filter(student__in=current_user.students.all())
        else:
            qs = qs.filter(student=current_user)
        return qs

    def perform_create(self, serializer):
        current_user = self.request.user
        competency = get_object_or_404(Competency, pk=self.kwargs['parent_lookup_competency'])
        serializer.save(student=current_user, competency=competency)
