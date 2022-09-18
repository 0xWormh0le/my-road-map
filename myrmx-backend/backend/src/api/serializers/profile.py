from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode as uid_decoder
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from urllib.parse import urlencode

from api.fields import PkWithStringRelatedField
from api.models import RecentCompetency
from api.serializers.shared import OptimizeUrlFieldsSerializerMixin, generate_detail_view_name, BasicUserSerializer
from api.shared import get_unsubscribe_user_frontend_link, send_email_from_react_frontend
from dashboard.models import Competency, Comment, User, Assessment, Company, Attachment
from dashboard.util import get_invite_token
from notifications.models import Notification


class NotificationCompetencySerializer(serializers.ModelSerializer):
    stage_title = serializers.ReadOnlyField(source='stage.title')
    stage_id = serializers.ReadOnlyField(source='stage.id')
    roadmap_id = serializers.ReadOnlyField(source='stage.roadmap.id')

    class Meta:
        model = Competency
        fields = ['id', 'title', 'stage_title', 'stage_id', 'roadmap_id']


class NotificationCommentSerializer(serializers.ModelSerializer):
    competency = NotificationCompetencySerializer()
    student_id = serializers.ReadOnlyField(source='student.id')

    class Meta:
        model = Comment
        fields = ['id', 'competency', 'student_id']


class NotificationAttachmentSerializer(serializers.ModelSerializer):
    competency = NotificationCompetencySerializer()
    student_id = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Attachment
        fields = ['id', 'competency', 'student_id']


class DefaultNotificationSerializer(OptimizeUrlFieldsSerializerMixin, serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'notification'

    url = serializers.HyperlinkedIdentityField(view_name=generate_detail_view_name(DEFAULT_BASE_NAME))
    sender = serializers.SerializerMethodField()
    target = serializers.SerializerMethodField()
    verb_display = serializers.ReadOnlyField(source='get_verb_display')
    unix_timestamp = serializers.SerializerMethodField()
    target_is_missing = serializers.SerializerMethodField()

    _serializers_cache = {
        User: (BasicUserSerializer, None),
        Comment: (NotificationCommentSerializer, None),
        Competency: (NotificationCompetencySerializer, None),
        Assessment: (NotificationCompetencySerializer, lambda a: a.competency),
        Attachment: (NotificationAttachmentSerializer, None),
    }

    class Meta:
        model = Notification
        fields = '__all__'

    def get_sender(self, notification):
        return self._get_serialized_generic_fk_target(notification.sender_object)

    def get_target(self, notification):
        return self._get_serialized_generic_fk_target(notification.target_object)

    def get_unix_timestamp(self, notification):
        return round(notification.timestamp.timestamp() * 1e3)

    def get_target_is_missing(self, notification):
        return notification.verb != Notification.NEW_USER and notification.target_object is None

    def _get_serialized_generic_fk_target(self, gfk_object):
        if not gfk_object:
            return None

        gfk_model = type(gfk_object)
        if gfk_model not in self._serializers_cache or not self._serializers_cache[gfk_model][0]:
            _, attr_selector = self._serializers_cache[gfk_model] \
                if gfk_model in self._serializers_cache else (None, None)
            serializer_model = type(attr_selector(gfk_object) if attr_selector else gfk_object)

            class GenericFKModelSerializer(serializers.ModelSerializer):
                class Meta:
                    model = serializer_model
                    fields = "__all__"

            self._serializers_cache[gfk_model] = GenericFKModelSerializer, attr_selector

        serializer_class, attr_selector = self._serializers_cache[gfk_model]
        serializer_input = attr_selector(gfk_object) if attr_selector else gfk_object
        return serializer_class(serializer_input).data


class BasicCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('id', 'name', 'logo',)


class ProfileUserSerializer(serializers.ModelSerializer):
    cohort = serializers.StringRelatedField(many=True, read_only=True)
    groups = serializers.StringRelatedField(many=True, read_only=True)
    company_id = serializers.ReadOnlyField(source='company.id')
    company_name = serializers.ReadOnlyField(source='company.name')
    all_companies = serializers.SerializerMethodField()
    default_theme = serializers.ReadOnlyField(source='company.default_theme')
    features = serializers.SerializerMethodField()
    synonyms = serializers.SerializerMethodField()
    coaches = serializers.SerializerMethodField()
    students = serializers.SerializerMethodField()
    user_is_approved = serializers.ReadOnlyField(source='is_approved')

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email', 'phone_number', 'bio', 'photo',
            'cohort', 'groups', 'company_id', 'company_name', 'all_companies', 'default_theme',
            'features', 'synonyms', 'coaches', 'students', 'user_is_approved', 'date_joined',
        )
        extra_kwargs = {
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
            'photo': {'allow_null': True},
        }

    def get_features(self, user):
        return {
            'can_assign_roadmaps': user.company.user_can_asssign_roadmaps,
            'can_assign_coach': user.company.users_can_assign_coach,
            'can_add_action_items': user.company.users_can_add_action_items,
            'can_erase_their_account': user.company.users_can_erase_their_account,
            'coach_can_assign_roadmaps': user.company.coach_can_asssign_roadmaps,
            'can_attach_files': user.company.users_can_attach_files,
            'can_invite_coach': user.company.users_can_invite_coach,
            'can_assign_specific_coaches_for_specific_roadmaps':
                user.company.users_can_assign_specific_coaches_for_specific_roadmaps,
            'coach_approves_green_assessments': user.company.coaches_approve_green_assessments,
            'coach_or_admin_can_assess_objectives': user.company.coaches_admin_can_assess_objectives,
            'roadmaps_are_archived': user.company.archive_roadmaps,
            'competency_notes_journal_enabled': user.company.competency_notes_journal_section,
            'slider_for_competency_assessment': user.company.slider_for_competency_assessment,
            'group_specific_roadmaps_enabled': user.company.group_specific_roadmaps,
            'coach_notes_enabled': user.company.coach_notes,
            'coach_admin_can_edit_competencies_visibility': user.company.coach_admin_edit_visibility_user_objectives,
            'coach_admin_can_assign_user_specific_competencies':
                user.company.coach_admin_assign_user_specifc_objectives,
            'show_print_competency_button': user.company.show_print_competency_detail_button,
        }

    def get_synonyms(self, user):
        default_user_synonym = "User"
        return {
            'coach': user.company.coach_synonym or "Coach",
            'user': user.company.user_synonym or default_user_synonym,
            'assessment': user.company.assessment_synonym or "Assessment",
            'student': user.company.user_synonym if user.company.user_synonym != default_user_synonym else "Student",
        }

    def get_all_companies(self, user):
        active_companies = list(
            filter(lambda c: bool(c), map(lambda u: u.company, User.objects.filter(email=user.email, is_active=True))))
        return BasicCompanySerializer(active_companies, many=True).data

    def get_coaches(self, user):
        current_user = self.context['request'].user if 'request' in self.context else None
        if not current_user:
            return []
        coaches = user.coach.filter(company=current_user.company)
        return PkWithStringRelatedField(many=True, read_only=True).to_representation(coaches)

    def get_students(self, user):
        current_user = self.context['request'].user if 'request' in self.context else None
        if not current_user:
            return []
        students = user.students.filter(company=current_user.company)
        return BasicUserSerializer(students, many=True, read_only=True).data


class RecentCompetencySerializer(serializers.ModelSerializer):
    DEFAULT_BASE_NAME = 'recent-competency'

    url = serializers.HyperlinkedIdentityField(view_name=generate_detail_view_name(DEFAULT_BASE_NAME))
    roadmap_id = serializers.ReadOnlyField(source='competency.stage.roadmap.id')

    class Meta:
        model = RecentCompetency
        fields = ('id', 'url', 'roadmap_id', 'competency')


class UnsubscribeUserSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):
        # Decode the uidb64 to uid to get User object
        try:
            uid = force_text(uid_decoder(attrs['uid']))
            User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise ValidationError({'uid': ['Invalid value']})

        if User.get_unsubscribe_token(uid) != attrs['token']:
            raise ValidationError({'token': ['Invalid value']})

        return attrs

    def save(self):
        uid = force_text(uid_decoder(self.validated_data['uid']))
        User.update_unsubscribed(uid, self.validated_data['token'])


class InviteCoachRequestSerializer(serializers.Serializer):
    coach_email = serializers.EmailField()

    def validate(self, attrs):
        current_user = self.context['request'].user if 'request' in self.context else None
        if not current_user:
            return
        coach_email = attrs['coach_email']
        try:
            coach = User.objects.get(email=coach_email, company=current_user.company)
        except User.DoesNotExist:
            pass
        else:
            if coach == current_user:
                raise ValidationError({'coach_email': ['You can not coach yourself']})
        return attrs

    def save(self):
        current_user = self.context['request'].user if 'request' in self.context else None
        if not current_user:
            return
        coach_email = self.validated_data['coach_email']
        try:
            coach = User.objects.get(email=coach_email, company=current_user.company)
        except User.DoesNotExist:
            coach = None
        invite_url = f'/accept-coach-invite/{current_user.id}/{get_invite_token(current_user.id, current_user.email)}'
        if not coach:
            query = {
                'is-coach': 'true',
                'company-name': current_user.company.name,
                'next': invite_url,
            }
            invite_url = f'/sign-up?{urlencode(query)}'
        links = {'primary_link': invite_url}
        if coach:
            links['unsubscribe_url'] = get_unsubscribe_user_frontend_link(coach)
        send_email_from_react_frontend(
            '{} - {} invited you to be their coach'.format(current_user.company.name, current_user.get_full_name()),
            'You have been invited to be a coach.',
            current_user,
            'dashboard/email-coach-invitation.html',
            recipients=[coach_email],
            links=links,
            additional_context={
                'invite': True,
            }
        )
