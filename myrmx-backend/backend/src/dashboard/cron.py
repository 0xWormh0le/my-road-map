import datetime

from django.db.models import Count, Q
from django.utils.timezone import timedelta, now
from django.urls import reverse

from dashboard.models import User, Company, Competency, ActionItemAssessment
from dashboard.util import send_email_from_django_frontend
from notifications.models import Notification
from notifications.signals import notify


TIMEDELTA = timedelta(hours=24)
ACTIVITY_THRESHOLD = timedelta(weeks=1)


def send_coach_daily_digest():
    # For each company, find the coaches, then send an email with the notifications for just that company
    for company in Company.objects.all():
        all_coaches = User.objects.filter(
            groups__name="Coach",
            company=company,
            unsubscribed=False,
            valid_email=True,
            notifications__sender_company=company,
            notifications__read=False,
            notifications__timestamp__range=[now()-TIMEDELTA, now()],
            ).annotate(unread_notifications_count=Count('notifications'))
        for coach in all_coaches:
            if coach.unread_notifications_count:
                all_students = User.objects.\
                    filter(groups__name='User', company=company, coach=coach).order_by('-last_seen')
                active_students = all_students.filter(last_seen__range=[now()-ACTIVITY_THRESHOLD, now()])
                inactive_students = all_students.filter(~Q(last_seen__range=[now()-ACTIVITY_THRESHOLD, now()]))
                active_remainder = active_students.count() - 3
                inactive_remainder = inactive_students.count() -3
                send_email_from_django_frontend(
                    '{} - Your daily digest'.format(company.name),
                    f'You have {coach.unread_notifications_count} unread notifications. Login to view.',
                    coach,
                    'dashboard/coach_digest_html.html',
                    links={
                        'home': '/',
                        'notifications': '/notifications',
                    },
                    additional_context={
                        'unread_notifications_count': coach.unread_notifications_count,
                        'active_students': active_students[:3],
                        'active_remainder': active_remainder if active_remainder > 0 else None,
                        'inactive_students': inactive_students[:3],
                        'inactive_remainder': inactive_remainder if inactive_remainder > 0 else None,
                        'recipient': coach,
                    },
                )


def send_user_daily_digest():
    for company in Company.objects.all():
        all_users = User.objects.filter(
            groups__name="User",
            company=company,
            unsubscribed=False,
            valid_email=True,
            notifications__sender_company=company,
            notifications__read=False,
            notifications__timestamp__range=[now()-TIMEDELTA, now()],
        ).annotate(unread_notifications_count=Count('notifications'))
        for user in all_users:
            if user.unread_notifications_count:
                send_email_from_django_frontend(
                    '{} - Your daily digest'.format(company.name),
                    f'You have {user.unread_notifications_count} unread notifications. Login to view.',
                    user,
                    'dashboard/user_digest_html.html',
                    links={
                        'home': '/',
                        'notifications': "/notifications",
                    },
                )


def send_action_item_reminder_email():
    for company in Company.objects.all():
        relevant_action_items = ActionItemAssessment.objects.all().filter(due_date=datetime.date.today())
        relevant_action_items = [obj for obj in relevant_action_items if obj.company == company]
        for item in relevant_action_items:
            send_email_from_django_frontend(
                '{} - Action Item is Due Today!'.format(company.name),
                'Go to your Roadmap. Click here.',
                item.student,
                'dashboard/action_item_reminder_email.html',
                primary_link=reverse('competency', args=[item.competency.id]),
                additional_context={
                    'item_description': item.description,
                    'item_competency': item.competency.title,
                    'item_roadmap': item.competency.roadmap.title,
                },
            )


def send_action_item_reminder_email_to_coaches():
    for company in Company.objects.all():
        relevant_action_items = ActionItemAssessment.objects.all().filter(due_date=datetime.date.today())
        relevant_action_items = [obj for obj in relevant_action_items if obj.company == company]
        for item in relevant_action_items:
            coaches = User.objects.filter(groups__name="Coach", company=company, students=item.student).distinct()
            for coach in coaches:
                send_email_from_django_frontend(
                    'Follow Up Reminder - Action Item is Due Today!',
                    'Log into MyRoadmap to view the Action Items that are due today.',
                    coach,
                    'dashboard/action_item_reminder_email_to_coaches.html',
                    primary_link=f"/users/{item.student.id}/competency/{item.competency.id}",
                    additional_context={
                        'user_synonym': coach.company.user_synonym,
                        'users_name': item.student,
                        'item_description': item.description,
                        'item_competency': item.competency.title,
                        'item_roadmap': item.competency.roadmap.title,
                    }
                )


def send_daily_assessment():
    # Get all competencies with daily assessment = true
    competencies = Competency.objects.filter(daily_assessment=True)
    for competency in competencies:
        # Get all students who are assigned to a roadmap that has that competency
        students = User.objects.filter(roadmaps=competency.roadmap, unsubscribed=False)
        for student in students:
            notify.send(student, recipient=student, verb=Notification.DAILY_ASSESSMENT, target=competency,
                        daily_assessment=True, competency=competency.id, student=student.id,
                        red_description=competency.daily_assessment_red,
                        yellow_description=competency.daily_assessment_yellow,
                        green_description=competency.daily_assessment_green)
