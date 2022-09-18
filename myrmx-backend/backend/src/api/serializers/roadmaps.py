from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import ValidationError, PermissionDenied

from api.relations import NestedHyperlinkedIdentityField
from api.serializers.shared import (
    AttachmentsSerializerMixin, OptimizeUrlFieldsSerializerMixin, generate_list_view_name, generate_detail_view_name,
    BasicUserSerializer, is_details_scope_specified,
)
from api.shared import (
    prepare_roadmap_stages_queryset, prepare_stage_competencies_queryset, get_assigned_coaches_qs, get_student_from_query,
)
from dashboard.models import (
    Roadmap, Stage, Competency, Comment, ActionItemGlobal, Assessment, ActionItemAssessment, User, Note, QuestionGlobal,
    QuestionAnswer,
)
from dashboard.views import get_stages_with_progress, get_action_items


roadmap_stage_competency_nested_item_url_field_parent_lookups = [
    ('competency__stage__roadmap', 'competency__stage__roadmap_id'),
    ('competency__stage', 'competency__stage_id'),
    ('competency', 'competency_id'),
]


class RoadmapStageCompetencyGlobalActionItemSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'roadmap-stage-competency-actionitemglobal'

    url = NestedHyperlinkedIdentityField(
        view_name=generate_detail_view_name(DEFAULT_BASE_NAME),
        parent_lookups=roadmap_stage_competency_nested_item_url_field_parent_lookups)
    resolutions = serializers.MultipleChoiceField(ActionItemGlobal.RESOLUTIONS)

    class Meta:
        model = ActionItemGlobal
        fields = '__all__'
        extra_kwargs = {
            'aiTitle': {'required': True, 'allow_blank': False},
            'competency': {'required': False},
        }

    def validate(self, data):
        if not self.partial and 'resolutions' not in data:
            raise ValidationError({'resolutions': 'At least one resolution is required.'})
        return data


class RoadmapStageCompetencyCommentSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'roadmap-stage-competency-comment'

    url = NestedHyperlinkedIdentityField(
        view_name=generate_detail_view_name(DEFAULT_BASE_NAME),
        parent_lookups=roadmap_stage_competency_nested_item_url_field_parent_lookups)
    user = BasicUserSerializer(read_only=True)
    user_id = serializers.IntegerField()

    class Meta:
        model = Comment
        fields = '__all__'


class RoadmapStageCompetencyAssessmentSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'roadmap-stage-competency-assessment'

    url = NestedHyperlinkedIdentityField(
        view_name=generate_detail_view_name(DEFAULT_BASE_NAME),
        parent_lookups=roadmap_stage_competency_nested_item_url_field_parent_lookups)

    class Meta:
        model = Assessment
        fields = '__all__'
        extra_kwargs = {
            'student': {'required': False},
            'competency': {'required': False},
            'user': {'required': False},
        }


class RoadmapStageCompetencyActionItemAssessmentSerializer(
    OptimizeUrlFieldsSerializerMixin, AttachmentsSerializerMixin, serializers.ModelSerializer
):
    DEFAULT_BASE_NAME = 'roadmap-stage-competency-actionitemassessment'

    url = NestedHyperlinkedIdentityField(
        view_name=generate_detail_view_name(DEFAULT_BASE_NAME),
        parent_lookups=roadmap_stage_competency_nested_item_url_field_parent_lookups)

    title = serializers.ReadOnlyField(source='parent.aiTitle')
    resolutions = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    order = serializers.SerializerMethodField()

    class Meta:
        model = ActionItemAssessment
        fields = ['id', 'url', 'parent', 'title', 'description', 'effective_description', 'due_date', 'marked_done',
                  'date_marked_done', 'approved_done', 'date_approved_done', 'notes', 'order', 'assessmentAttachment',
                  'assessmentScreen', 'assessmentAudio', 'competency', 'student', 'resolutions', 'attachments']
        extra_kwargs = {
            'competency': {'required': True},
        }

    def get_resolutions(self, action_item):
        return action_item.parent.resolutions if action_item.parent else [ActionItemGlobal.RESOLUTIONS[0][0]]

    def get_order(self, action_item):
        return action_item.parent.order if action_item.parent else action_item.order


class RoadmapStageCompetencyNoteSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'roadmap-stage-competency-note'

    url = NestedHyperlinkedIdentityField(
        view_name=generate_detail_view_name(DEFAULT_BASE_NAME),
        parent_lookups=roadmap_stage_competency_nested_item_url_field_parent_lookups)

    class Meta:
        model = Note
        fields = '__all__'
        extra_kwargs = {
            'student': {'required': False},
            'competency': {'required': False},
        }


class RoadmapStageCompetencyGlobalQuestionSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'roadmap-stage-competency-globalquestion'

    url = NestedHyperlinkedIdentityField(
        view_name=generate_detail_view_name(DEFAULT_BASE_NAME),
        parent_lookups=roadmap_stage_competency_nested_item_url_field_parent_lookups)

    class Meta:
        model = QuestionGlobal
        fields = '__all__'
        extra_kwargs = {
            'competency': {'required': False},
        }


class RoadmapStageCompetencyQuestionAnswerSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'roadmap-stage-competency-questionanswer'

    url = NestedHyperlinkedIdentityField(
        view_name=generate_detail_view_name(DEFAULT_BASE_NAME),
        parent_lookups=roadmap_stage_competency_nested_item_url_field_parent_lookups)

    class Meta:
        model = QuestionAnswer
        fields = '__all__'
        extra_kwargs = {
            'answer': {'required': True},
            'student': {'required': False},
            'competency': {'required': False},
        }
        validators = []

    def validate_parent(self, value):
        if 'view' in self.context and 'parent_lookup_competency' in self.context['view'].kwargs:
            competency_id = self.context['view'].kwargs['parent_lookup_competency']
            if value.competency.id != int(competency_id):
                raise serializers.ValidationError(
                    f"Global question with ID '{value.id}' does not belong to competency with ID = {competency_id}")
        return value

    def validate(self, data):
        if 'request' in self.context and 'parent_lookup_competency' in self.context['view'].kwargs and not self.partial:
            if 'parent' not in data:
                raise ValidationError({'parent': f'This field is required.'})
            current_user = self.context['request'].user
            question = data['parent']
            try:
                QuestionAnswer.objects.get(student=current_user, parent=question)
            except QuestionAnswer.DoesNotExist:
                pass
            else:
                raise ValidationError(f'Answer from current user to question with ID={question.id} already exists.')
        return data


roadmap_stage_competency_nested_items_list_url_field_kwargs = {
    'parent_lookups': [
        ('competency__stage__roadmap', 'stage__roadmap_id'),
        ('competency__stage', 'stage_id'),
    ],
    'lookup_url_kwarg': 'parent_lookup_competency',
}


class RoadmapStageCompetencySerializer(
    OptimizeUrlFieldsSerializerMixin, AttachmentsSerializerMixin, serializers.ModelSerializer
):
    DEFAULT_BASE_NAME = 'roadmap-stage-competency'
    attachments_filter_kwargs = {'actionItem__isnull': True}

    url = NestedHyperlinkedIdentityField(view_name=generate_detail_view_name(DEFAULT_BASE_NAME), parent_lookups=[
        ('stage__roadmap', 'stage__roadmap_id'),
        ('stage', 'stage_id'),
    ])
    comments_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(RoadmapStageCompetencyCommentSerializer.DEFAULT_BASE_NAME),
        **roadmap_stage_competency_nested_items_list_url_field_kwargs)
    global_action_items_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(RoadmapStageCompetencyGlobalActionItemSerializer.DEFAULT_BASE_NAME),
        **roadmap_stage_competency_nested_items_list_url_field_kwargs)
    assessments_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(RoadmapStageCompetencyAssessmentSerializer.DEFAULT_BASE_NAME),
        **roadmap_stage_competency_nested_items_list_url_field_kwargs)
    action_item_assessments_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(RoadmapStageCompetencyActionItemAssessmentSerializer.DEFAULT_BASE_NAME),
        **roadmap_stage_competency_nested_items_list_url_field_kwargs)
    notes_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(RoadmapStageCompetencyNoteSerializer.DEFAULT_BASE_NAME),
        **roadmap_stage_competency_nested_items_list_url_field_kwargs)
    global_questions_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(RoadmapStageCompetencyGlobalQuestionSerializer.DEFAULT_BASE_NAME),
        **roadmap_stage_competency_nested_items_list_url_field_kwargs)
    question_answers_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(RoadmapStageCompetencyQuestionAnswerSerializer.DEFAULT_BASE_NAME),
        **roadmap_stage_competency_nested_items_list_url_field_kwargs)

    comments_count = serializers.SerializerMethodField()
    last_assessment_status = serializers.SerializerMethodField()
    last_non_student_assessment_status = serializers.SerializerMethodField()
    last_assessment_date = serializers.SerializerMethodField()
    last_assessment_approved = serializers.SerializerMethodField()
    last_assessment_rejected = serializers.SerializerMethodField()
    total_action_item_assessments_count = serializers.SerializerMethodField()
    done_action_item_assessments_count = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    action_item_ids = serializers.SerializerMethodField()

    class Meta:
        model = Competency
        fields = '__all__'
        extra_kwargs = {
            'stage': {'required': False},
        }

    def get_comments_count(self, competency):
        student = self._get_student()
        return competency.get_comments(student.id).count() if student else None

    def get_last_assessment_status(self, competency):
        last_assessment = self._get_last_student_assessment(competency)
        return last_assessment.status if last_assessment else None

    def get_last_non_student_assessment_status(self, competency):
        current_user = self.context['request'].user if 'request' in self.context else None
        if not current_user or not current_user.company.coaches_admin_can_assess_objectives:
            return None
        student = self._get_student()
        if not student:
            return None
        last_assessment = competency.assessment_set.filter(
            Q(student=student) & ~Q(user=student)).order_by('-id').first()
        return last_assessment.status if last_assessment else None

    def get_last_assessment_date(self, competency):
        last_assessment = self._get_last_student_assessment(competency)
        return last_assessment.date if last_assessment else None

    def get_total_action_item_assessments_count(self, competency):
        student = self._get_student()
        return competency.actionitemassessment_set.filter(student=student, archived=False).count() if student else None

    def get_done_action_item_assessments_count(self, competency):
        student = self._get_student()
        return competency.actionitemassessment_set.filter(
            student=student, archived=False, marked_done=True).count() if student else None

    def get_action_item_ids(self, competency):
        student = self._get_student()
        if not student:
            return []
        # This pre-creates action items needed
        get_action_items(student, competency.id)
        qs = ActionItemAssessment.objects.filter(competency=competency).filter(student=student, archived=False)
        return qs.values_list('id', flat=True)

    def get_last_assessment_approved(self, competency):
        last_assessment = self._get_last_student_assessment(competency)
        return last_assessment.approved if last_assessment else None

    def get_last_assessment_rejected(self, competency):
        last_assessment = self._get_last_student_assessment(competency)
        return last_assessment.rejected if last_assessment else None

    def _get_last_student_assessment(self, competency):
        student = self._get_student()
        if not student:
            return None
        return competency.assessment_set.filter(student=student, user=student).order_by('-id').first()

    def _get_student(self):
        if 'request' not in self.context:
            return None
        request = self.context['request']
        student = get_student_from_query(request)
        if student:
            return student
        current_user = request.user
        return current_user if current_user.is_student() else None


class RoadmapStageSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'roadmap-stage'

    url = NestedHyperlinkedIdentityField(view_name=generate_detail_view_name(DEFAULT_BASE_NAME), parent_lookups=[
        ('roadmap', 'roadmap_id'),
    ])
    competencies_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(
            RoadmapStageCompetencySerializer.DEFAULT_BASE_NAME),
        parent_lookups=[('stage__roadmap', 'roadmap_id')],
        lookup_url_kwarg='parent_lookup_stage',
    )
    competency_ids = serializers.SerializerMethodField()

    class Meta:
        model = Stage
        fields = '__all__'

    def get_competency_ids(self, stage):
        request = self.context['request'] if 'request' in self.context else None
        if not request:
            return []
        current_user = request.user
        if not current_user:
            return []
        qs = Competency.objects.filter(stage=stage)
        student = get_student_from_query(request)
        qs = prepare_stage_competencies_queryset(qs, current_user, student)
        return qs.values_list('id', flat=True)


class AssignedCoachSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    ASSIGNED_COACH_BASE_NAME = 'assigned-coach'
    AVAILABLE_COACH_BASE_NAME = 'available-coach'

    coach_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'photo', 'email', 'coach_id')

    def validate_coach_id(self, value):
        try:
            User.objects.get(pk=value, groups__name="Coach")
        except User.DoesNotExist:
            raise serializers.ValidationError(f"Coach with ID '{value}' does not exist")
        return value


roadmap_nested_items_list_url_field_kwargs = {
    'lookup_url_kwarg': 'parent_lookup_roadmap',
}


class DefaultRoadmapSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'roadmap'

    url = serializers.HyperlinkedIdentityField(view_name=generate_detail_view_name(DEFAULT_BASE_NAME))
    stages_url = serializers.HyperlinkedIdentityField(
        view_name=generate_list_view_name(RoadmapStageSerializer.DEFAULT_BASE_NAME),
        **roadmap_nested_items_list_url_field_kwargs,
    )
    assigned_coaches_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(AssignedCoachSerializer.ASSIGNED_COACH_BASE_NAME),
        **roadmap_nested_items_list_url_field_kwargs,
    )
    available_coaches_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(AssignedCoachSerializer.AVAILABLE_COACH_BASE_NAME),
        **roadmap_nested_items_list_url_field_kwargs,
    )
    stats = serializers.SerializerMethodField()
    stage_ids = serializers.SerializerMethodField()
    assigned_coaches = serializers.SerializerMethodField()

    class Meta:
        model = Roadmap
        fields = '__all__'

    def get_stats(self, roadmap):
        result = {}
        if 'request' in self.context:
            current_user = self.context['request'].user
            stats = get_stages_with_progress(current_user, roadmap.id)
            result['total_progress'] = stats['total_progress']
        return result

    def get_stage_ids(self, roadmap):
        current_user = self.context['request'].user if 'request' in self.context else None
        if not current_user:
            return []
        qs = Stage.objects.filter(roadmap=roadmap)
        qs = prepare_roadmap_stages_queryset(qs, current_user)
        return qs.values_list('id', flat=True)

    def get_assigned_coaches(self, roadmap):
        current_user = self.context['request'].user if 'request' in self.context else None
        if not current_user or\
                not current_user.company.users_can_assign_specific_coaches_for_specific_roadmaps or\
                not is_details_scope_specified(self.context['request'].query_params, 'assigned-coaches'):
            return []
        return BasicUserSerializer(get_assigned_coaches_qs(current_user, roadmap), many=True, read_only=True).data


class StudentActionSerializer(serializers.Serializer):
    student = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(groups__name="User"), required=True)
