from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Q
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.exceptions import ValidationError, PermissionDenied

from dashboard.models import User


def prepare_roadmap_stages_queryset(qs, current_user):
    if current_user.is_superuser:
        pass  # Keep qs as is
    elif current_user.is_admin() or current_user.is_coach():
        qs = qs.filter(roadmap__company=current_user.company)
    else:
        qs = qs.filter(roadmap__in=current_user.roadmaps.values_list('pk', flat=True))
    return qs


def prepare_stage_competencies_queryset(qs, current_user, student):
    if student:
        return qs.filter(stage__roadmap__in=student.roadmaps.values_list('pk', flat=True)).\
            filter(Q(user_defined=False) | Q(student=student)).\
            filter(~Q(hidden_for=student) & ~Q(hidden_for_all_users=True))
    if current_user.is_superuser:
        pass  # Keep qs as is
    elif current_user.is_admin() or current_user.is_coach():
        qs = qs.filter(stage__roadmap__company=current_user.company)
    else:
        qs = qs.filter(stage__roadmap__in=current_user.roadmaps.values_list('pk', flat=True)).\
            filter(Q(user_defined=False) | Q(student=current_user)).\
            filter(~Q(hidden_for=current_user) & ~Q(hidden_for_all_users=True))
    return qs


def get_unsubscribe_user_frontend_link(user):
    return f'/unsubscribe/{urlsafe_base64_encode(force_bytes(user.id))}/{User.get_unsubscribe_token(user.id)}/'


def get_assigned_coaches_qs(current_user, roadmap):
    coach_ids = map(lambda ar: ar.coach.id, current_user.get_current_assigned_roadmaps(roadmap_id=roadmap.id))
    return User.objects.filter(pk__in=coach_ids).order_by('id')


def send_email_from_react_frontend(
        subject, message, user, template_name, recipients=None, primary_link=None, links=None, additional_context=None):
    domain = user.company.react_frontend_base_url or settings.REACT_FRONTEND_BASE_URL
    context = {
        'user': user,
        'unsubscribe_url': f"{domain}{get_unsubscribe_user_frontend_link(user)}",
    }
    if primary_link:
        context['primary_link'] = f"{domain}{primary_link}"
    elif links:
        for key, value in links.items():
            context[key] = f"{domain}{value}"
    if additional_context:
        context.update(additional_context)
    effective_from_email = settings.DEFAULT_FROM_EMAIL
    if user.company.from_email:
        effective_from_email = f"{user.company.name} <{user.company.from_email}>"
    send_mail(
        subject,
        message(context) if callable(message) else message,
        effective_from_email,
        recipients or [user.email],
        fail_silently=False,
        html_message=render_to_string(template_name, context=context),
    )


def current_user_role_is_overriden(view):
    current_user = view.request.user
    return current_user.is_admin() and current_user.is_coach() and 'forRole' in view.request.query_params and \
           view.request.query_params['forRole'] in ['admin', 'coach']


def get_effective_current_user_role_object(view, admin_obj, coach_obj):
    return admin_obj if view.request.query_params['forRole'] == 'admin' else coach_obj


def get_student_from_query(request):
    if 'forStudent' not in request.query_params:
        return None
    student_id = request.query_params['forStudent']
    try:
        student = User.objects.get(pk=student_id)
    except User.DoesNotExist:
        raise ValidationError({'forStudent': f"There's no user with ID {student_id}"})
    current_user = request.user
    if not current_user.is_admin() and not (current_user.is_coach() and student in current_user.students.all()) \
            and not student == current_user:
        raise PermissionDenied(f"Current user can't fetch data of student with ID {student_id}")
    return student
