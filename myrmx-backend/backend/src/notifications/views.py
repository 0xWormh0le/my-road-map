import logging

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, Http404, HttpResponseRedirect, redirect, get_object_or_404

from dashboard.models import Comment, Competency, Stage, User
from .models import Notification
from push_notifications.gcm import GCMError
from push_notifications.models import GCMDevice


logger = logging.getLogger(__name__)


@login_required
def all(request):
    mark_all_as_read = request.GET.get('r')
    notifications = Notification.objects.all_for_user(request.user).filter(sender_company=request.user.company).order_by('-timestamp').prefetch_related('target_object', 'sender_object', 'recipient')
    competency_ids = []
    stage_ids = []
    student_ids = []
    for notification in notifications:
        if isinstance(notification.target_object, Comment):
            competency_ids.append(notification.target_object.competency_id)
            student_ids.append(notification.target_object.student_id)
        elif notification.target_object and hasattr(notification.target_object, 'stage_id') and notification.target_object.stage_id:
            stage_ids.append(notification.target_object.stage_id)
    competencies = {c.id: c for c in Competency.objects.filter(id__in=competency_ids).prefetch_related('stage__roadmap')}
    stages = {s.id: s for s in Stage.objects.filter(id__in=stage_ids).prefetch_related('roadmap')}
    students = {s.id: s for s in User.objects.filter(id__in=student_ids)}
    for notification in notifications:
        if isinstance(notification.target_object, Comment):
            notification.target_object.competency = competencies.get(notification.target_object.competency_id)
            notification.target_object.student = students.get(notification.target_object.student_id)
        elif notification.target_object and hasattr(notification.target_object, 'stage_id') and notification.target_object.stage_id:
            notification.target_object.stage = stages.get(notification.target_object.stage_id)
    if mark_all_as_read:
        for notification in notifications:
            notification.read = True
            notification.save()
        messages.success(request, 'All notifications marked as read.')
        GCMDevices = GCMDevice.objects.filter(user=request.user)
        try:
            GCMDevices.send_message(None, content_available=True, badge="0")
        except GCMError:
            logger.warning('Failed to multicast badge update to GCMDevices', exc_info=True)
    context = {
        'notifications': notifications,
    }
    return render(request, 'notifications/all.html', context)


@login_required
def read(request, id):
    notification = get_object_or_404(Notification, id=id)
    try:
        next = request.GET.get('next', None)
        if notification.recipient == request.user:
            notification.read = True
            notification.save()
            user = User.objects.filter(email=request.user.email).first()
            notifications = Notification.objects.all_for_user(user)
            count = notifications.unread().count()
            GCMDevices = GCMDevice.objects.filter(user=request.user)
            try:
                GCMDevices.send_message(None, content_available=True, badge=count)
            except GCMError:
                logger.warning('Failed to multicast badge update to GCMDevices', exc_info=True)
            if next is not None:
                return HttpResponseRedirect(next)
            else:
                return redirect('notifications:notifications_all')
        else:
            raise Http404
    except:
        return redirect('notifications:notifications_all')


def get_notifications_ajax(request):
    if request.user.is_authenticated and request.is_ajax() and request.method == 'POST':
        notifications = Notification.objects.all_for_user(request.user).filter(sender_company=request.user.company)
        count = notifications.unread().count()
        notifications = notifications.recent()
        notes = []
        for note in notifications:
            notes.append(str(note.get_link))
        data = {
            'notifications': notes,
            'count': count,
        }
        return JsonResponse(data)
    else:
        return JsonResponse({})