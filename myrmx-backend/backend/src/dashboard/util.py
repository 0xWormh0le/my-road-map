import hashlib

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.urls import reverse

from dashboard.models import User


def get_invite_token(user_id, email):
    m = hashlib.sha256()
    m.update('{}{}{}'.format(user_id, email, 'dsfasdf23rjlaksdjfxzcvasdf234$#!').encode('utf8'))
    return m.hexdigest()


def send_email_from_django_frontend(
        subject, message, user, template_name, recipients=None, primary_link=None, links=None, additional_context=None):
    domain = user.company.django_frontend_base_url or settings.DJANGO_FRONTEND_BASE_URL
    unsubscribe_url = reverse('email_unsubscribe', kwargs={
        'user_id': user.id,
        'token': User.get_unsubscribe_token(user.id),
    })
    context = {
        'user': user,
        'unsubscribe_url': f"{domain}{unsubscribe_url}",
    }
    if primary_link:
        context['primary_link'] = f"{domain}{primary_link}"
    elif links:
        for key, value in links.items():
            context[key] = f"{domain}{value}"
    if additional_context:
        context.update(additional_context)
    rest_of_kwargs = {}
    if template_name:
        rest_of_kwargs['html_message'] = render_to_string(template_name, context=context)
    effective_from_email = settings.DEFAULT_FROM_EMAIL
    if user.company.from_email:
        effective_from_email = f"{user.company.name} <{user.company.from_email}>"
    send_mail(
        subject,
        message(context) if callable(message) else message,
        effective_from_email,
        recipients or [user.email],
        fail_silently=False,
        **rest_of_kwargs,
    )


def send_coach_accepted_invitation_email(coach, user):
    if user.unsubscribed or not user.valid_email:
        return
    send_email_from_django_frontend(
        '{} - Coach invitation accepted'.format(coach.company.name),
        '{} has accepted your invitation to be your coach.'.format(coach.get_full_name()),
        user,
        'dashboard/new_assigned_coach_html.html',
        primary_link='/',
        additional_context={
            'is_coach': False,
            'accepted_invite': True,
            'coach': coach,
            'coaches': [coach],
            'coaches_count': 1,
        },
    )
