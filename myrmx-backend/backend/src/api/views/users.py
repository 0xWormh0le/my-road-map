import uuid

from django.db import transaction
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_extensions.mixins import NestedViewSetMixin

from api.filters import UsersViewsetOrderingFilter
from api.forms import CompanyAwarePasswordResetForm
from api.permissions import ApprovedUserPermission, AdminOrReadOnlyObjectPermission, AdminOnlyPermission
from api.serializers import (
    UserWithAssignedRoadmapsSerializer, CoachStudentSerializer, AdminEditableUserSerializer, BasicCohortSerializer,
)
from api.serializers.shared import BasicUserSerializer
from api.shared import (
    send_email_from_react_frontend, current_user_role_is_overriden, get_effective_current_user_role_object,
)
from dashboard.models import User, Cohort


class UsersViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    This is users API endpoint.

    If current user has both admin & coach roles use ?forRole=admin or ?forRole=coach to get corresponding response.
    """

    COMMON_BASE_NAME = UserWithAssignedRoadmapsSerializer.DEFAULT_BASE_NAME
    filter_backends = [UsersViewsetOrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = [
        'first_name', 'last_name', 'last_login', UsersViewsetOrderingFilter.red_assessments_count_ordering_key,
        UsersViewsetOrderingFilter.max_progress_ordering_key, 'email', 'last_seen',
    ]
    search_fields = ['first_name', 'last_name', 'email', 'bio', 'coach_notes_regarding_student']
    filterset_fields = ['groups__name']

    def get_queryset(self):
        current_user = self.request.user
        admin_qs = User.objects.filter(company=current_user.company)
        if current_user.is_cohort_admin():
            admin_qs = admin_qs.filter(cohort__in=current_user.cohort.all())
        coach_qs = User.objects.filter(coach=current_user)
        if current_user_role_is_overriden(self):
            qs = get_effective_current_user_role_object(self, admin_qs, coach_qs)
        elif current_user.is_superuser:
            qs = User.objects
        elif current_user.is_admin():
            qs = admin_qs
        elif current_user.is_coach():
            qs = coach_qs
        else:
            qs = User.objects.filter(pk=current_user.pk)
        return qs.order_by('id')

    def get_serializer_class(self):
        current_user = self.request.user
        if current_user_role_is_overriden(self):
            return get_effective_current_user_role_object(self, AdminEditableUserSerializer, CoachStudentSerializer)
        elif current_user.is_admin():
            return AdminEditableUserSerializer
        if current_user.is_coach():
            return CoachStudentSerializer
        return UserWithAssignedRoadmapsSerializer

    def perform_create(self, serializer):
        current_user = self.request.user
        email = serializer.validated_data.get('email')
        existing_user = User.objects.filter(email=email).first() if email else None
        password = existing_user.password if existing_user else None
        with transaction.atomic():
            save_kwargs = {
                'company': current_user.company,
                'username': str(uuid.uuid4()),
                'is_active': True,
            }
            if serializer.validated_data.get('is_approved') is None:
                save_kwargs['is_approved'] = False if current_user.company.requires_approval else True
            if password:
                save_kwargs['password'] = password
            serializer.save(**save_kwargs)
        self._send_welcome_email(self.request, serializer.instance)
        user_coaches = set(serializer.instance.coach.all())
        if user_coaches:
            self._notify_new_coaches(serializer.instance, user_coaches)

    def perform_destroy(self, user):
        current_user = self.request.user
        if not (current_user.is_superuser or current_user.is_admin()):
            raise PermissionDenied("Current user has no permissions to remove users")
        if current_user.is_admin() and current_user.company != user.company:
            raise PermissionDenied("Admin users can't remove users from other companies")
        user.delete()

    @action(detail=True, methods=['post'], url_path='resend-welcome-email',
            permission_classes=[IsAuthenticated, AdminOnlyPermission])
    def resend_welcome_email(self, request, **kwargs):
        user = get_object_or_404(User, pk=self.kwargs['pk'])
        self._send_welcome_email(request, user)
        return Response(status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        current_coaches = set(serializer.instance.coach.all())
        save_kwargs = {}
        if not serializer.instance.email and not serializer.validated_data.get('email'):
            save_kwargs['email'] = None
        updated_user = serializer.save(**save_kwargs)
        new_coaches = set(updated_user.coach.all()).difference(current_coaches)
        if new_coaches:
            self._notify_new_coaches(updated_user, new_coaches)
            send_email_from_react_frontend(
                'MyRoadmap - Meet your new {}'.format(self.request.user.company.coach_synonym),
                'A new {} has been added to your account.'.format(self.request.user.company.coach_synonym),
                updated_user,
                'dashboard/new_assigned_coach_html.html',
                primary_link='/dashboard',
                additional_context={
                    'is_coach': False,
                    'coaches': new_coaches,
                    'coaches_count': len(new_coaches),
                }
            )

    def _notify_new_coaches(self, student, coaches):
        for coach in coaches:
            if not coach.unsubscribed and coach.valid_email:
                send_email_from_react_frontend(
                    'MyRoadmap - Meet your new {}'.format(self.request.user.company.user_synonym),
                    'A new user has been added to your dashboard',
                    coach,
                    'dashboard/new_assigned_coach_html.html',
                    primary_link='/',
                    additional_context={
                        'is_coach': True,
                        'new_user': student,
                    }
                )

    def _send_welcome_email(self, request, user):
        reset_password_form = CompanyAwarePasswordResetForm(data={'email': user.email})
        if reset_password_form.is_valid() and user.email and not user.email.startswith('_donotsend'):
            reset_password_form.save(
                request=request,
                subject_template_name='registration/new_account_subject.html',
                email_template_name='registration/new_account_text.html',
                html_email_template_name='registration/new_account_html.html',
                extra_email_context={'request': request}
            )


class CohortViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    This is cohorts API endpoint.
    """
    serializer_class = BasicCohortSerializer
    queryset = Cohort.objects.order_by('id')
    permission_classes = (IsAuthenticated, ApprovedUserPermission, AdminOrReadOnlyObjectPermission,)
    filter_backends = [OrderingFilter]
    ordering_fields = ['name']

    def get_queryset(self):
        qs = super().get_queryset()
        current_user = self.request.user
        if current_user.is_superuser:
            pass  # Keep qs as is
        else:
            qs = qs.filter(company=current_user.company)
        return qs

    def perform_create(self, serializer):
        current_user = self.request.user
        serializer.save(company=current_user.company)


class CohortUsersViewSet(NestedViewSetMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This is cohort users API endpoint.
    """
    serializer_class = BasicUserSerializer
    permission_classes = (IsAuthenticated, ApprovedUserPermission, AdminOrReadOnlyObjectPermission,)

    def get_queryset(self):
        cohort = get_object_or_404(Cohort, pk=self.kwargs['parent_lookup_cohort'])
        return User.objects.filter(cohort=cohort).order_by('id')
