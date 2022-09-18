import logging

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from dashboard.models import User
from notifications.models import Notification
from notifications.signals import notify


logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        for admin in User.objects.filter(groups__name='Admin', company=instance.company).all():
            notify.send(instance, recipient=admin, verb=Notification.NEW_USER)


@receiver(post_delete, sender=User)
def delete_user_notifications(sender, instance, **kwargs):
    Notification.objects.filter(sender_object_id=instance.id).delete()
