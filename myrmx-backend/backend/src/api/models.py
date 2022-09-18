from django.db import models

from dashboard.models import Competency, User


class RecentCompetency(models.Model):
    user = models.ForeignKey(User, related_name='recent_competencies', on_delete=models.CASCADE)
    competency = models.ForeignKey(Competency, related_name='+', on_delete=models.CASCADE)


class PeerLastReadMessageTimestamp(models.Model):
    user = models.ForeignKey(User, related_name='+', on_delete=models.CASCADE)
    peer_id = models.CharField(max_length=150)
    timestamp = models.BigIntegerField()

    class Meta:
        unique_together = (('user', 'peer_id'),)


class PeerToPeerMessage(models.Model):
    sender = models.ForeignKey(User, related_name='+', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='+', on_delete=models.CASCADE)
    text = models.CharField(max_length=4096)  # Limit is the same as Telegram's limit
    timestamp = models.BigIntegerField()
    latest = models.BooleanField(default=False)  # Means if this is the latest message in this sender/receiver pair
