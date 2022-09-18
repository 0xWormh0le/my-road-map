from rest_framework import serializers

from api.models import PeerLastReadMessageTimestamp, PeerToPeerMessage
from api.serializers.shared import BasicUserSerializer


class PeerLastReadMessageTimestampSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeerLastReadMessageTimestamp
        fields = ('peer_id', 'timestamp')


# TODO: Add hyperlinked field to conversation messages
class ConversationSerializer(serializers.ModelSerializer):
    sender = BasicUserSerializer(read_only=True)
    receiver = BasicUserSerializer(read_only=True)
    receiver_username = serializers.CharField(write_only=True)
    last_read_msg_timestamp = serializers.IntegerField(read_only=True)

    class Meta:
        model = PeerToPeerMessage
        fields = ('sender', 'receiver', 'timestamp', 'text', 'receiver_username', 'last_read_msg_timestamp')


class ConversationMessageSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer(source='sender', read_only=True)

    class Meta:
        model = PeerToPeerMessage
        fields = ('user', 'timestamp', 'text')
