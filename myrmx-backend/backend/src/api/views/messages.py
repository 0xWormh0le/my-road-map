import time

from django.conf import settings
from django.db import transaction
from django.db.models import Q
from django.http import Http404
from rest_framework import viewsets, generics, status, mixins
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_extensions.mixins import NestedViewSetMixin

from api.agora_tokens.RtmTokenBuilder import RtmTokenBuilder, Role_Rtm_User
from api.models import PeerLastReadMessageTimestamp, PeerToPeerMessage
from api.serializers import (
    BasicUserSerializer, PeerLastReadMessageTimestampSerializer, ConversationSerializer, ConversationMessageSerializer,
)
from dashboard.models import User


class MessageRecipientsAPIView(generics.ListAPIView):
    serializer_class = BasicUserSerializer
    search_fields = ['first_name', 'last_name']

    def get_queryset(self):
        current_user = self.request.user
        qs = User.objects.none()
        if current_user.is_coach():
            qs = qs.union(User.objects.filter(coach=current_user))
        qs = qs.union(current_user.coach.all()).distinct()
        return qs.order_by('id')


class PeerLastReadMessageTimestampsViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This is peer last read messages timestamps API endpoint.
    """
    serializer_class = PeerLastReadMessageTimestampSerializer

    def get_queryset(self):
        current_user = self.request.user
        return PeerLastReadMessageTimestamp.objects.filter(user=current_user).order_by('-timestamp')

    def perform_create(self, serializer):
        current_user = self.request.user
        peer_id = serializer.validated_data.get('peer_id')
        try:
            existing_timestamp = PeerLastReadMessageTimestamp.objects.get(peer_id=peer_id, user=current_user)
            serializer.instance = existing_timestamp
        except PeerLastReadMessageTimestamp.DoesNotExist:
            pass
        serializer.save(user=self.request.user)


class GenerateAgoraRTMTokenAPIView(APIView):
    def get(self, request, *args, **kwargs):
        current_user = request.user
        app_id = settings.AGORA_APP_ID
        app_certificate = settings.AGORA_APP_CERTIFICATE
        user = current_user.username
        expiration_time_in_seconds = 86400  # 1 day = 60 secs/minute * 60 minutes/hour * 24 hours/day
        privilege_expired_ts = int(time.time()) + expiration_time_in_seconds
        token = RtmTokenBuilder.buildToken(app_id, app_certificate, user, Role_Rtm_User, privilege_expired_ts)
        response = Response({'token': token}, status=status.HTTP_200_OK)
        return self.finalize_response(request, response, *args, **kwargs)


class PeerToPeerConversationsViewSet(
    NestedViewSetMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    This is peer to peer conversations API endpoint.
    """
    serializer_class = ConversationSerializer
    lookup_value_regex = '[^/]+'
    search_fields = ['text', 'sender__first_name', 'sender__last_name', 'receiver__first_name', 'receiver__last_name']

    def get_queryset(self):
        current_user = self.request.user
        return PeerToPeerMessage.objects.\
            filter(Q(latest=True) & (
                (Q(sender=current_user) & Q(receiver__company=current_user.company))
                |
                (Q(receiver=current_user) & Q(sender__company=current_user.company))
            )).\
            order_by('-timestamp')

    def perform_create(self, serializer):
        current_user = self.request.user
        peer_id = serializer.validated_data.pop('receiver_username')
        try:
            peer_user = User.objects.get(username=peer_id)
        except User.DoesNotExist:
            raise ValidationError({f'No user with "{peer_id}" username'})
        with transaction.atomic():
            PeerToPeerMessage.objects.\
                filter(
                    Q(latest=True) & (
                        (Q(sender=current_user) & Q(receiver=peer_user))
                        | (Q(sender=peer_user) & Q(receiver=current_user))
                    )
                ).update(latest=False)
            serializer.save(sender=self.request.user, receiver=peer_user, latest=True)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            current_user = self.request.user
            all_peers_timestamps = PeerLastReadMessageTimestamp.objects.filter(
                peer_id__in=((msg.receiver if msg.sender == current_user else msg.sender).username for msg in page))
            for msg in page:
                peer_id = (msg.receiver if msg.sender == current_user else msg.sender).username
                try:
                    peer_timestamp = next(filter(lambda t: t.peer_id == peer_id, all_peers_timestamps))
                except StopIteration:
                    pass
                else:
                    msg.last_read_msg_timestamp = peer_timestamp.timestamp
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PeerToPeerConversationMessagesViewSet(NestedViewSetMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This is peer to peer conversation messages API endpoint.
    """
    serializer_class = ConversationMessageSerializer

    def get_queryset(self):
        parents_dict = self.get_parents_query_dict()
        if 'peer_id' not in parents_dict:
            raise Http404

        try:
            peer_user = User.objects.get(username=parents_dict['peer_id'])
        except User.DoesNotExist:
            raise Http404

        current_user = self.request.user
        return PeerToPeerMessage.objects.\
            filter(
                (Q(sender=current_user) & Q(receiver=peer_user)) |
                (Q(sender=peer_user) & Q(receiver=current_user))
            ).\
            order_by('-timestamp')
