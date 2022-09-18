import json
import logging

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.urls import reverse

from dashboard.models import Competency, Comment, User, Company
from rest_framework.authtoken.models import Token

from .signals import notify

from push_notifications.gcm import GCMError
from push_notifications.models import GCMDevice, WebPushDevice
from push_notifications.webpush import WebPushError

import re


TAG_RE = re.compile(r'<[^>]+>')
logger = logging.getLogger(__name__)


def remove_tags(text):
    return TAG_RE.sub('', text)

class NotificationQuerySet(models.query.QuerySet):
    def get_user(self, recipient):
        return self.filter(recipient=recipient)

    def mark_targetless(self, recipient):
        qs = self.unread().get_user(recipient)
        qs_no_target = qs.filter(target_object_id=None)

    # if qs_no_target:
    # qs_no_target.update(read=True)

    def mark_all_read(self, recipient):
        qs = self.unread().get_user(recipient)
        qs.update(read=True)

    def mark_all_unread(self, recipient):
        qs = self.read().get_user(recipient)
        qs.update(read=False)

    def unread(self):
        return self.filter(read=False)

    def read(self):
        return self.filter(read=True)

    def recent(self):
        return self.unread()[:5]


class NotificationManager(models.Manager):
    def get_queryset(self):
        return NotificationQuerySet(self.model, using=self._db)

    def all_unread(self, user):
        return self.get_queryset().get_user(user).unread()

    def all_read(self, user):
        return self.get_queryset().get_user(user).read()

    def all_for_user(self, user):
        self.get_queryset().mark_targetless(user)
        return self.get_queryset().get_user(user)

    def get_recent_for_user(self, user, num):
        return self.get_queryset().get_user(user)[:num]


class Notification(models.Model):
    COMMENTED = 'COMMENTED'
    NEEDS_APPROVAL = 'NEEDS_APPROVAL'
    APPROVED = 'APPROVED'
    NEEDS_WORK = 'NEEDS_WORK'
    NEW_USER = 'NEW_USER'
    NEW_ACTION_ITEM = 'NEW_ACTION_ITEM'
    AI_NEEDS_APPROVAL = 'AI_NEEDS_APPROVAL'
    AI_APPROVED = 'AI_APPROVED'
    NEW_COMPETENCY = "NEW_COMPETENCY"
    DAILY_ASSESSMENT = "DAILY_ASSESSMENT"
    NEW_FILE_ATTACHED = "NEW_FILE_ATTACHED"
    AI_RESPONSE_UPDATED = "AI_RESPONSE_UPDATED"

    NOTIFICATION_CHOICES = (
        (COMMENTED, 'commented on'),
        (NEEDS_APPROVAL, 'needs approval on'),
        (APPROVED, 'approved assessment for'),
        (NEEDS_WORK, 'marked assessment as needs work for'),
        (NEW_USER, 'New account'),
        (NEW_ACTION_ITEM, 'created an action item for'),
        (AI_NEEDS_APPROVAL, 'needs approval for an action item on'),
        (AI_APPROVED, 'approved action item for'),
        (NEW_COMPETENCY, 'created a Competency -'),
        (DAILY_ASSESSMENT, 'Do your daily assessment for'),
        (NEW_FILE_ATTACHED, 'attached new file to'),
        (AI_RESPONSE_UPDATED, 'added or updated response for an action item on'),
    )
    sender_content_type = models.ForeignKey(ContentType, related_name='nofity_sender', on_delete=models.CASCADE)
    sender_object_id = models.PositiveIntegerField()
    sender_object = GenericForeignKey('sender_content_type', 'sender_object_id')
    sender_company = models.ForeignKey(Company, blank=True, null=True, on_delete=models.CASCADE)

    verb = models.CharField(
        max_length=255,
        choices=NOTIFICATION_CHOICES
    )

    action_content_type = models.ForeignKey(ContentType, related_name='notify_action',
                                            null=True, blank=True, on_delete=models.CASCADE)
    action_object_id = models.PositiveIntegerField(null=True, blank=True)
    action_object = GenericForeignKey('action_content_type', 'action_object_id')

    target_content_type = models.ForeignKey(ContentType, related_name='notify_target',
                                            null=True, blank=True, on_delete=models.CASCADE)
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target_object = GenericForeignKey('target_content_type', 'target_object_id')

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notifications', on_delete=models.CASCADE)
    read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    objects = NotificationManager()

    def _get_context(self, default_target_url=None):
        if self.verb == Notification.NEW_FILE_ATTACHED:
            target = self.target_object.competency
            target_url = f'/competency/{target.pk}'
        elif self.target_object:
            is_competency = isinstance(self.target_object, Competency)
            target = self.target_object if is_competency else self.target_object.competency
            get_target_id = self.target_object.get_target_id()
            verbs_for_us = (Notification.APPROVED, Notification.NEEDS_WORK, Notification.NEW_ACTION_ITEM, Notification.AI_APPROVED)
            if (not is_competency and self.recipient.id == self.target_object.student_id) or self.verb in verbs_for_us:
                target_url = f'/competency/{get_target_id}'
            elif self.verb == Notification.NEW_COMPETENCY:
                target_user = self.recipient.id
                target_url = f'/competency/{get_target_id}'
            else:
                target_user = self.sender_object.id if is_competency else self.target_object.get_target_user()
                target_url = f'/users/{target_user}/competency/{get_target_id}'
        else:
            target = None
            target_url = reverse('profile_detail', kwargs={'pk': self.sender_object_id})
        return {
            'sender': self.sender_object,
            'verb': self.get_verb_display(),
            'action': self.action_object,
            'target': self.target_object or '',
            'verify_read': reverse('notifications:notifications_read', kwargs={'id': self.id}),
            'target': target,
            'target_url': target_url,
        }

    def __str__(self):
        context = self._get_context()
        # if self.target_object:
            # if self.action_object and context['target_url']:
            #     return '{sender} {verb} <a href="{verify_read}?next={target_url}">{target}</a> with {action}'.format(**context)
            # if self.action_object and not context['target_url']:
            #     return '{sender} {verb} {target} with {action}'.format(**context)
        if self.verb == Notification.NEW_USER:
            return 'New Account: <b>{sender}</b>'.format(**context)
        if self.verb == Notification.DAILY_ASSESSMENT:
            return 'Do your daily assessment for {target}'.format(**context)
        if context['target_url'] and not self.action_object:
            return '<b>{sender}</b> {verb} {target}'.format(**context)
        return '{sender} {verb} {target}'.format(**context)

    @property
    def get_link(self):
        context = self._get_context(default_target_url=reverse('notifications:notifications_all'))
        return '<a href="{verify_read}?next={target_url}">{sender} {verb} {target}</a>'.format(**context)

    @property
    def get_link_2(self):
        context = self._get_context(default_target_url=reverse('notifications:notifications_all'))
        return '{verify_read}?next={target_url}'.format(**context)


def _insert_notification(sender, recipient, verb, kwargs):
    new_note = Notification(
        recipient=recipient,
        verb=verb,  # smart_text
        sender_content_type=ContentType.objects.get_for_model(sender),
        sender_object_id=sender.id,
        sender_company=sender.company,
    )
    for option in ('target', 'action'):
        obj = kwargs.pop(option, None)
        if obj is not None:
            setattr(new_note, '{}_content_type'.format(option), ContentType.objects.get_for_model(obj))
            setattr(new_note, '{}_object_id'.format(option), obj.id)
    new_note.save()
    GCMDevices = GCMDevice.objects.filter(user=recipient)
    WPDevices = WebPushDevice.objects.filter(user=recipient)
    user = User.objects.filter(email=recipient.email).first()
    notifications = Notification.objects.all_for_user(user)
    count = notifications.unread().count()
    token, _ = Token.objects.get_or_create(user=user)
    competency = Competency.objects.filter(id=kwargs.get('competency')).first()
    if 'daily_assessment' in kwargs:
        msg = "Hi " + user.first_name + ", " + competency.daily_assessment_question
        for device in GCMDevices:
            if (device.name == 'iOS'):
                device.send_message(msg, title="Assessment Notification", badge=count, click_action='DAILY_ASSESSMENT', mutable_content="1", extra={'competency': kwargs.get('competency'),'student': kwargs.get('student'),'red_description':kwargs.get('red_description'),'yellow_description':kwargs.get('yellow_description'),'green_description':kwargs.get('green_description'),'token':token.key})
            elif (device.name == 'android'):
                device.send_message(None, extra={'type':'DAILY_ASSESSMENT','notif_title':'Assessment Notification','notif_description':msg,'competency': kwargs.get('competency'),'student': kwargs.get('student'),'red_description':kwargs.get('red_description'),'yellow_description':kwargs.get('yellow_description'),'green_description':kwargs.get('green_description'),'token':token.key})
    else:
        msg = remove_tags(str(new_note))
        try:
            GCMDevices.send_message(msg, title="Activity Notification", badge=count)
        except GCMError:
            logger.warning('Failed to multicast activity notification to GCMDevices', exc_info=True)
    for device in WPDevices:
        try:
            device.send_message(json.dumps({'title':"Notification",'message':msg}))
        except WebPushError as e:
            result = re.search('{(.*)}', e.args[0])
            if result is None:
                continue
            try:
                error = json.loads(result.group(0))
            except json.JSONDecodeError:
                continue
            if error['code'] in [404, 410]:
                # remove device from db
                device.delete()

class NoticeType(models.Model):
    def create(self, type='', title='', msg=''):
        print("noticeType")

# Send push notifications for postman notifications
def send(users=[], label='', extra_context={}):
    GCMDevices = GCMDevice.objects.filter(user=users[0])
    WPDevices = WebPushDevice.objects.filter(user=users[0])
    msg = "You have a new message: "+str(extra_context["pm_message"])
    try:
        GCMDevices.send_message(msg, title="Message Notification")
    except GCMError:
        logger.warning('Failed to multicast Postman message notification to GCMDevices', exc_info=True)
    for device in WPDevices:
        try:
            device.send_message(json.dumps({'title':"Message Notification",'message':msg}))
        except WebPushError as e:
            result = re.search('{(.*)}', e.args[0])
            if result is None:
                return None
            error = json.loads(result.group(0))
            print(error)
            if error['code'] in [404, 410]:
                # remove device from db
                device.delete()

def new_notification(sender, **kwargs):
    kwargs.pop('signal', None)
    recipient = kwargs.pop('recipient')
    verb = kwargs.pop('verb')
    affected_users = kwargs.pop('affected_users', None)
    if affected_users is not None:
        for u in affected_users:
            if u != sender:
                _insert_notification(sender, u, verb, kwargs)
    else:
        _insert_notification(sender, recipient, verb, kwargs)


notify.connect(new_notification)

# actor (AUTH_USER_MODEL)
# has commented ("verb")
# with a Comment (id=32) (instance action_object)
# on your Comment (id=12) (targeted instance)
# so now you should know about it (AUTH_USER_MODEL)

# <instance of a user>
# <something> #verb to
# <instance of a model> #to
# <instance of a model> #tell
# <instance of a user>
