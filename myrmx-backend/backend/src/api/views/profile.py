import logging

from django.conf import settings
from django.contrib.auth import login as django_login, logout as django_logout
from django.db import transaction
from django.shortcuts import get_object_or_404
from push_notifications.gcm import GCMError
from push_notifications.models import GCMDevice
from rest_auth.app_settings import create_token, TokenSerializer
from rest_auth.models import TokenModel
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import RecentCompetency, PeerLastReadMessageTimestamp, PeerToPeerMessage
from api.permissions import ApprovedUserPermission, CoachOnlyPermission
from api.serializers import (
    DefaultNotificationSerializer, ProfileUserSerializer, RecentCompetencySerializer, UnsubscribeUserSerializer,
    BasicUserSerializer, InviteCoachRequestSerializer,
)
from dashboard.models import Competency, Comment, Company, User, Attachment
from dashboard.util import get_invite_token
from notifications.models import Notification


logger = logging.getLogger(__name__)


class CurrentUserNotificationsViewSet(viewsets.ModelViewSet):
    """
    This is current user notifications API endpoint.
    """
    serializer_class = DefaultNotificationSerializer
    filterset_fields = ['verb']

    def get_queryset(self):
        return self._get_current_user_notifications().\
            prefetch_related('target_object', 'sender_object', 'recipient').order_by('-timestamp')

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_as_read(self, request):
        self._get_current_user_notifications().unread().update(read=True)
        self._send_badge_to_user_devices("0")
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='mark-comments-read')
    def mark_comments_as_read(self, request):
        if 'comments' not in request.data:
            raise ValidationError({'comments': 'This field is required'})
        self._get_current_user_notifications().unread().\
            filter(verb=Notification.COMMENTED, target_object_id__in=request.data['comments']).\
            update(read=True)
        return Response(status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        read_before_save = serializer.instance.read
        notification = serializer.save()
        if notification.read and not read_before_save:
            unread_count = self._get_current_user_notifications().unread().count()
            self._send_badge_to_user_devices(unread_count)

    def _get_current_user_notifications(self):
        current_user = self.request.user
        return Notification.objects.all_for_user(current_user).filter(sender_company=current_user.company)

    def _send_badge_to_user_devices(self, value):
        user_devices = GCMDevice.objects.filter(user=self.request.user)
        try:
            user_devices.send_message(None, content_available=True, badge=value)
        except GCMError:
            logger.warning('Failed to multicast badge update to GCMDevices', exc_info=True)


class UserProfileAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileUserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def perform_destroy(self, user):
        if not user.company.users_can_erase_their_account:
            raise PermissionDenied(f"The company of the current user restricted users from removing their accounts")
        user.delete()
        if getattr(settings, 'REST_SESSION_LOGIN', True):
            django_logout(self.request)


def ensure_student_unseen_activity_initialized(unseen_activity, student_pk):
    if student_pk not in unseen_activity:
        unseen_activity[student_pk] = {
            'roadmaps': [],
            'competencies': [],
            'competency_comments': [],
            'comments': [],
        }
    return unseen_activity[student_pk]


def merge_student_unseen_activity_items(student_unseen_activity, key, new_items_iterable):
    existing_items = student_unseen_activity[key]
    merged_items = set([*existing_items, *new_items_iterable])
    student_unseen_activity[key] = merged_items


def merge_unseen_competencies(unseen_activity, notifications_qs, student_id_field):
    notifications_info = notifications_qs.\
        filter(target_object_id__isnull=False).values('target_object_id', student_id_field)
    unseen_competency_info = Competency.objects.\
        select_related('competency__stage', 'competency__stage__roadmap').\
        filter(pk__in=map(lambda i: i['target_object_id'], notifications_info)).\
        values('pk', 'stage__roadmap__pk')
    unseen_competency_student_ids = set(list(map(lambda i: i[student_id_field], notifications_info)))
    for student_pk in unseen_competency_student_ids:
        student_unseen_activity = ensure_student_unseen_activity_initialized(unseen_activity, student_pk)
        student_competency_ids = set((i['target_object_id'] for i in notifications_info
                                      if i[student_id_field] == student_pk))
        merge_student_unseen_activity_items(student_unseen_activity, 'competencies', student_competency_ids)
        student_roadmaps_ids = set((i['stage__roadmap__pk'] for i in unseen_competency_info
                                    if i['pk'] in student_competency_ids))
        merge_student_unseen_activity_items(student_unseen_activity, 'roadmaps', student_roadmaps_ids)


def build_unseen_activity(unread_notifications):
    unseen_activity = {}

    unseen_comment_ids_qs = unread_notifications.filter(
        verb=Notification.COMMENTED, target_object_id__isnull=False).values_list('target_object_id', flat=True)
    unseen_comments_info = Comment.objects. \
        select_related('competency', 'competency__stage', 'competency__stage__roadmap'). \
        filter(pk__in=unseen_comment_ids_qs). \
        values('pk', 'competency__pk', 'competency__stage__roadmap__pk', 'student__pk')
    unseen_comments_student_ids = set(list(map(lambda i: i['student__pk'], unseen_comments_info)))
    for student_pk in unseen_comments_student_ids:
        student_unseen_activity = ensure_student_unseen_activity_initialized(unseen_activity, student_pk)
        student_unseen_comments_info = list(filter(lambda i: i['student__pk'] == student_pk, unseen_comments_info))
        merge_student_unseen_activity_items(
            student_unseen_activity, 'comments', map(lambda i: i['pk'], student_unseen_comments_info))
        merge_student_unseen_activity_items(
            student_unseen_activity, 'roadmaps',
            map(lambda i: i['competency__stage__roadmap__pk'], student_unseen_comments_info))
        unseen_competency_with_comments_ids = \
            set(list(map(lambda i: i['competency__pk'], student_unseen_comments_info)))
        merge_student_unseen_activity_items(
            student_unseen_activity, 'competencies', unseen_competency_with_comments_ids)
        merge_student_unseen_activity_items(
            student_unseen_activity, 'competency_comments', unseen_competency_with_comments_ids)

    unseen_attachment_ids_qs = unread_notifications.filter(
        verb=Notification.NEW_FILE_ATTACHED, target_object_id__isnull=False).values_list('target_object_id', flat=True)
    unseen_attachments_info = Attachment.objects. \
        select_related('competency', 'competency__stage', 'competency__stage__roadmap'). \
        filter(pk__in=unseen_attachment_ids_qs). \
        values('pk', 'competency__pk', 'competency__stage__roadmap__pk', 'user__pk')
    unseen_attachments_student_ids = set(list(map(lambda i: i['user__pk'], unseen_attachments_info)))
    for student_pk in unseen_attachments_student_ids:
        student_unseen_activity = ensure_student_unseen_activity_initialized(unseen_activity, student_pk)
        student_unseen_attachments_info = \
            list(filter(lambda i: i['user__pk'] == student_pk, unseen_attachments_info))
        merge_student_unseen_activity_items(
            student_unseen_activity, 'roadmaps',
            map(lambda i: i['competency__stage__roadmap__pk'], student_unseen_attachments_info))
        merge_student_unseen_activity_items(student_unseen_activity, 'competencies',
                                            map(lambda i: i['competency__pk'], student_unseen_attachments_info))

    unseen_competencies_notification_verbs_with_student_as_sender = [
        Notification.NEEDS_APPROVAL,
        Notification.AI_NEEDS_APPROVAL,
        Notification.AI_RESPONSE_UPDATED,
    ]
    merge_unseen_competencies(
        unseen_activity,
        unread_notifications.filter(verb__in=unseen_competencies_notification_verbs_with_student_as_sender),
        'sender_object_id',
    )

    unseen_competencies_notification_verbs_with_student_as_recipient = [
        Notification.APPROVED,
        Notification.NEEDS_WORK,
        Notification.NEW_ACTION_ITEM,
        Notification.AI_APPROVED,
    ]
    merge_unseen_competencies(
        unseen_activity,
        unread_notifications.filter(verb__in=unseen_competencies_notification_verbs_with_student_as_recipient),
        'recipient__pk',
    )

    return unseen_activity


class UpdatesAPIView(APIView):
    def get(self, request, *args, **kwargs):
        current_user = request.user
        unread_notifications = Notification.objects.all_for_user(current_user).filter(
            sender_company=current_user.company).unread()
        unseen_comment_ids_qs = unread_notifications.filter(
            verb=Notification.COMMENTED, target_object_id__isnull=False).values_list('target_object_id', flat=True)

        # TODO: This is inaccurate but fine for now, should be sorted out later
        probably_unread_messages = PeerToPeerMessage.objects.filter(
            receiver=current_user, latest=True).values_list('sender__username', 'timestamp')
        peer_usernames = map(lambda x: x[0], probably_unread_messages)
        read_timestamps_dict = {ts_values[0]: ts_values[1] for ts_values in PeerLastReadMessageTimestamp.objects.filter(
            user=current_user, peer_id__in=peer_usernames).values_list('peer_id', 'timestamp')}
        unread_messages_count = sum(map(
            lambda x: (1 if x[1] > read_timestamps_dict[x[0]] else 0) if x[0] in read_timestamps_dict else 1,
            probably_unread_messages,
        )) + unseen_comment_ids_qs.count()

        payload = {
            'unread_notifications_count': unread_notifications.count(),
            'unread_messages_count': unread_messages_count,
            'unseen_activity': build_unseen_activity(unread_notifications),
        }
        response = Response(payload, status=status.HTTP_200_OK)
        return self.finalize_response(request, response, *args, **kwargs)


class RecentCompetenciesViewSet(viewsets.ModelViewSet):
    """
    This is recent competencies API endpoint.
    """
    serializer_class = RecentCompetencySerializer

    def get_queryset(self):
        current_user = self.request.user
        return RecentCompetency.objects.select_related('competency__stage__roadmap')\
            .filter(user=current_user).order_by('id')

    def perform_create(self, serializer):
        with transaction.atomic():
            new_recent_competency = serializer.save(user=self.request.user)
            self._ensure_single_recent_competency_per_roadmap(new_recent_competency)

    def perform_update(self, serializer):
        with transaction.atomic():
            recent_competency = serializer.save()
            self._ensure_single_recent_competency_per_roadmap(recent_competency)

    def _ensure_single_recent_competency_per_roadmap(self, current_rc):
        RecentCompetency.objects.filter(
            user=self.request.user, competency__stage__roadmap=current_rc.competency.stage.roadmap)\
            .exclude(pk=current_rc.id)\
            .delete()


class UnsubscribeUserView(generics.GenericAPIView):
    serializer_class = UnsubscribeUserSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "User has been successfully unsubscribed."}
        )


class ChooseActiveCompanyAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        company_id = request.data.get('company_id')
        try:
            company = Company.objects.get(pk=company_id)
        except Company.DoesNotExist:
            raise ValidationError({'company_id': f'Company with ID {company_id} not found'})
        try:
            user_to_switch_to = User.objects.get(email=request.user.email, company=company)
        except User.DoesNotExist:
            raise ValidationError(
                {'company_id': f'No user record with email {request.user.email} for company with ID {company_id}'})
        if getattr(settings, 'REST_SESSION_LOGIN', True):
            django_login(request, user_to_switch_to)
        token = create_token(TokenModel, user_to_switch_to, None)
        serializer = TokenSerializer(instance=token, context={'request': self.request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class InviteCoachView(generics.GenericAPIView):
    serializer_class = InviteCoachRequestSerializer

    def post(self, request, *args, **kwargs):
        if not request.user.company.users_can_assign_coach:
            raise PermissionDenied("Current user has no permissions to assign coaches")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)


class AcceptCoachInvitationView(generics.RetrieveAPIView, generics.CreateAPIView):
    serializer_class = BasicUserSerializer
    permission_classes = (IsAuthenticated, ApprovedUserPermission, CoachOnlyPermission,)

    def get_object(self):
        if 'uid' not in self.request.query_params:
            raise ValidationError({'uid': ['User ID query parameter is required']})
        if 'token' not in self.request.query_params:
            raise ValidationError({'token': ['Token query parameter is required']})
        user = get_object_or_404(User, pk=self.request.query_params['uid'])
        user_token = self.request.query_params['token']
        if user_token != get_invite_token(user.id, user.email):
            raise ValidationError({'token': ['Invalid value']})
        return user

    def create(self, request, *args, **kwargs):
        coach = self.request.user
        user = self.get_object()
        if user.company != coach.company:
            raise PermissionDenied("User and coach doesn't belong to the same company")
        user.coach.add(coach)
        return Response(status=status.HTTP_200_OK)


class RemoveCoachAPIView(APIView):
    def post(self, request, *args, **kwargs):
        current_user = self.request.user
        coach_id = self.request.data.get('coach_id')
        coach = current_user.coach.filter(pk=coach_id).first()
        if not coach:
            raise ValidationError({'coach_id': f"User's coach with ID {coach_id} not found"})
        current_user.coach.remove(coach)
        return Response(status=status.HTTP_200_OK)
