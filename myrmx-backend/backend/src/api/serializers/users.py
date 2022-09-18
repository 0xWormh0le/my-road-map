from django.db import connection
from rest_framework import serializers, exceptions
from rest_framework.validators import UniqueValidator

from api.fields import GroupStringRelatedField, PkWithStringRelatedField
from api.relations import NestedHyperlinkedIdentityField
from api.serializers.shared import OptimizeUrlFieldsSerializerMixin, generate_detail_view_name, generate_list_view_name
from api.shared import current_user_role_is_overriden, get_effective_current_user_role_object
from dashboard.models import Roadmap, Competency, User, ActionItemAssessment, RoadmapAssignment, Cohort


class AssignedRoadmapSerializer(serializers.ModelSerializer):
    ASSIGNED_ROADMAP_BASE_NAME = 'assigned-roadmap'
    ARCHIVED_ROADMAP_BASE_NAME = 'archived-roadmap'
    AVAILABLE_ROADMAP_BASE_NAME = 'available-roadmap'

    roadmap_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Roadmap
        fields = ('id', 'title', 'description', 'icon', 'roadmap_id')
        extra_kwargs = {
            'title': {'read_only': True},
        }

    def validate_roadmap_id(self, value):
        try:
            Roadmap.objects.get(pk=value)
        except Roadmap.DoesNotExist:
            raise serializers.ValidationError(f"Roadmap with ID '{value}' does not exist")
        return value


user_with_roadmaps_nested_items_list_url_field_kwargs = {
    'parent_lookups': [
        ('student', 'id'),
    ],
    'lookup_url_kwarg': 'parent_lookup_student',
}
user_base_fields = (
    'id', 'url', 'username', 'first_name', 'last_name', 'photo', 'last_seen', 'assigned_roadmaps_url',
    'archived_roadmaps_url', 'available_roadmaps_url',
)


class UserWithAssignedRoadmapsSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'user-with-assigned-roadmaps'

    url = serializers.HyperlinkedIdentityField(view_name=generate_detail_view_name(DEFAULT_BASE_NAME))
    assigned_roadmaps_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(AssignedRoadmapSerializer.ASSIGNED_ROADMAP_BASE_NAME),
        **user_with_roadmaps_nested_items_list_url_field_kwargs,
    )
    archived_roadmaps_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(AssignedRoadmapSerializer.ARCHIVED_ROADMAP_BASE_NAME),
        **user_with_roadmaps_nested_items_list_url_field_kwargs,
    )
    available_roadmaps_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(AssignedRoadmapSerializer.AVAILABLE_ROADMAP_BASE_NAME),
        **user_with_roadmaps_nested_items_list_url_field_kwargs,
    )

    class Meta:
        model = User
        fields = user_base_fields


def get_roadmap_competency_progress(student_id, competency_ids):
    if competency_ids.count() == 0:
        return 0
    query = """WITH assessment_summary AS (
        SELECT id, competency_id, status, ROW_NUMBER() OVER(PARTITION BY competency_id ORDER BY id DESC) AS rn
        FROM dashboard_assessment
        WHERE student_id = %s AND competency_id IN %s
    ) SELECT sum(assessment_summary.status) FROM assessment_summary WHERE assessment_summary.rn = 1"""
    with connection.cursor() as cursor:
        cursor.execute(query, [student_id, tuple(competency_ids)])
        return cursor.fetchone()[0] or 0


def get_red_assessments_count(student_id, competency_ids):
    if competency_ids.count() == 0:
        return 0
    query = """WITH assessment_summary AS (
        SELECT id, competency_id, status, ROW_NUMBER() OVER(PARTITION BY competency_id ORDER BY id DESC) AS rn
        FROM dashboard_assessment
        WHERE student_id = %s AND status = '1' AND competency_id IN %s
    ) SELECT count(*) FROM assessment_summary WHERE assessment_summary.rn = 1"""
    with connection.cursor() as cursor:
        cursor.execute(query, [student_id, tuple(competency_ids)])
        return cursor.fetchone()[0]


def get_approval_pending_items_count(student_id, competency_ids):
    if competency_ids.count() == 0:
        return 0
    assessments_query = """WITH assessment_summary AS (
        SELECT id, competency_id, status, approved, rejected,
            ROW_NUMBER() OVER(PARTITION BY competency_id ORDER BY id DESC) AS rn
        FROM dashboard_assessment
        WHERE student_id = %s AND status = '3' AND approved = 0 AND rejected = 0 AND competency_id IN %s
    ) SELECT count(*) FROM assessment_summary WHERE assessment_summary.rn = 1"""
    with connection.cursor() as cursor:
        cursor.execute(assessments_query, [student_id, tuple(competency_ids)])
        return cursor.fetchone()[0]


class CoachStudentRoadmapProgressSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    started_on = serializers.SerializerMethodField()
    red_assessments_count = serializers.SerializerMethodField()
    approval_pending_items_count = serializers.SerializerMethodField()

    class Meta:
        model = Roadmap
        fields = ('id', 'title', 'progress', 'started_on', 'red_assessments_count', 'approval_pending_items_count',)

    def get_progress(self, roadmap):
        student = self._get_student()
        if not student:
            return None
        competency_ids = Competency.objects.filter(stage__roadmap__id=roadmap.id).values_list('id', flat=True)
        competency_progress = get_roadmap_competency_progress(student.pk, competency_ids)
        total_competency_count = competency_ids.count()
        return round(float(competency_progress) / (total_competency_count * 3) * 100, 2) \
            if total_competency_count else 0

    def get_started_on(self, roadmap):
        student = self._get_student()
        if not student:
            return None
        last_assignment = \
            RoadmapAssignment.objects.filter(user=student, roadmap=roadmap).order_by('-date_assigned').first()
        return last_assignment.date_assigned if last_assignment else None

    def get_red_assessments_count(self, roadmap):
        student = self._get_student()
        if not student:
            return 0
        return get_red_assessments_count(
            student.pk, Competency.objects.filter(stage__roadmap__id=roadmap.id).values_list('id', flat=True))

    def get_approval_pending_items_count(self, roadmap):
        student = self._get_student()
        if not student:
            return 0
        return get_approval_pending_items_count(
            student.pk, Competency.objects.filter(stage__roadmap__id=roadmap.id).values_list('id', flat=True))

    def _get_student(self):
        return self.context['student'] if 'student' in self.context else None


user_extended_fields = (
    'last_login', 'roadmaps_info', 'red_assessments_count', 'approval_pending_items_count',
    'email', 'phone_number', 'bio', 'date_joined', 'is_active', 'coach', 'cohort', 'groups', 'is_approved',
)


class AdminEditableUserSerializer(UserWithAssignedRoadmapsSerializer):
    roadmaps_info = serializers.SerializerMethodField()
    red_assessments_count = serializers.SerializerMethodField()
    approval_pending_items_count = serializers.SerializerMethodField()
    coach = PkWithStringRelatedField(many=True, queryset=User.objects.all())
    cohort = PkWithStringRelatedField(many=True, queryset=Cohort.objects.all())
    groups = GroupStringRelatedField(many=True)

    class Meta:
        model = User
        fields = user_base_fields + user_extended_fields
        extra_kwargs = {
            'photo': {'allow_null': True},
            'username': {'required': False},
            'email': {'allow_blank': True},
        }

    def get_roadmaps_info(self, student):
        serializer_ctx = dict(self.context)
        serializer_ctx['student'] = student
        roadmaps = self._get_student_roadmaps(student)
        return CoachStudentRoadmapProgressSerializer(roadmaps, context=serializer_ctx, many=True).data

    def get_red_assessments_count(self, student):
        competency_ids = self._get_student_roadmap_competency_ids(student)
        return get_red_assessments_count(student.pk, competency_ids)

    def get_approval_pending_items_count(self, student):
        competency_ids = self._get_student_roadmap_competency_ids(student)
        pending_assessments_count = get_approval_pending_items_count(student.pk, competency_ids)
        action_items_pending = ActionItemAssessment.objects.filter(
            competency__id__in=competency_ids, student=student, marked_done=True, approved_done=False).count()
        return pending_assessments_count + action_items_pending

    def validate(self, data):
        current_user = self.context['request'].user if 'request' in self.context else None
        if current_user and current_user.company and 'email' in data:
            qs = User.objects.filter(company=current_user.company, email=data['email'])
            if self.instance and self.instance.pk:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise exceptions.ValidationError({'email': "User with the email specified already exists"})
        return data

    def _get_student_roadmaps(self, student):
        current_user = self.context['request'].user if 'request' in self.context else None
        if not current_user:
            return Roadmap.objects.none()
        if not current_user.company.users_can_assign_specific_coaches_for_specific_roadmaps:
            return student.roadmaps
        current_view = self.context['view'] if 'view' in self.context else None
        if not current_view:
            return Roadmap.objects.none()
        admin_filter_kwargs = {'roadmap__company': current_user.company}
        coach_filter_kwargs = {'coach': current_user}
        coach_filter_kwargs.update(admin_filter_kwargs)
        if current_user_role_is_overriden(current_view):
            effective_filter_kwargs = \
                get_effective_current_user_role_object(current_view, admin_filter_kwargs, coach_filter_kwargs)
        elif current_user.is_admin():
            effective_filter_kwargs = admin_filter_kwargs
        elif current_user.is_coach():
            effective_filter_kwargs = coach_filter_kwargs
        else:
            effective_filter_kwargs = {'pk': None}
        ids_qs = student.assigned_roadmaps.filter(**effective_filter_kwargs).values_list('roadmap_id', flat=True)
        return Roadmap.objects.filter(id__in=ids_qs)

    def _get_student_roadmap_competency_ids(self, student):
        roadmap_ids = self._get_student_roadmaps(student).values_list('id', flat=True)
        return Competency.objects.filter(stage__roadmap_id__in=roadmap_ids).values_list('id', flat=True)


class CoachStudentSerializer(AdminEditableUserSerializer):
    class Meta:
        model = User
        fields = user_base_fields + user_extended_fields
        read_only_fields = user_base_fields + user_extended_fields


class BasicCohortSerializer(serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'basic-cohort'
    COHORT_USERS_BASE_NAME = 'cohort-users'

    url = serializers.HyperlinkedIdentityField(view_name=generate_detail_view_name(DEFAULT_BASE_NAME))
    cohort_users_url = NestedHyperlinkedIdentityField(
        view_name=generate_list_view_name(COHORT_USERS_BASE_NAME),
        lookup_url_kwarg='parent_lookup_cohort')
    users_count = serializers.SerializerMethodField()
    coaches_count = serializers.SerializerMethodField()
    admins_count = serializers.SerializerMethodField()

    class Meta:
        model = Cohort
        fields = [
            'id', 'url', 'name', 'description', 'signup_url', 'created', 'cohort_users_url', 'users_count',
            'coaches_count', 'admins_count',
        ]
        extra_kwargs = {
            'name': {'required': True, 'allow_blank': False},
            'signup_url': {
                'allow_blank': False,
                'validators': [
                    UniqueValidator(
                        queryset=Cohort.objects.all(),
                        message='There is an existing cohort with this value, please choose a different one',
                    ),
                ],
            },
            'created': {'read_only': True},
        }

    def get_users_count(self, cohort):
        return cohort.users.filter(groups__name='User').count()

    def get_coaches_count(self, cohort):
        return cohort.users.filter(groups__name='Coach').count()

    def get_admins_count(self, cohort):
        return cohort.users.filter(groups__name='Admin').count()
