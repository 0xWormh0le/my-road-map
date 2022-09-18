from django.conf import settings
from django.contrib.auth.forms import PasswordResetForm

from api.shared import get_unsubscribe_user_frontend_link
from dashboard.models import Company


class CompanyAwarePasswordResetForm(PasswordResetForm):
    def send_mail(self, subject_template_name, email_template_name,
                  context, from_email, to_email, html_email_template_name=None):
        request = context['request']
        try:
            company = Company.objects.get(react_frontend_base_url__icontains=request.META['HTTP_ORIGIN'])
        except Company.DoesNotExist:
            company = None
        user = context['user']
        if not company:
            company = user.company
        domain = company.react_frontend_base_url or settings.REACT_FRONTEND_BASE_URL
        context.update({
            'unsubscribe_url': f"{domain}{get_unsubscribe_user_frontend_link(user)}",
            'primary_link': f"{domain}/reset-password/{context['uid']}/{context['token']}",
        })
        effective_from_email = from_email
        if company.from_email:
            effective_from_email = f"{company.name} <{company.from_email}>"
        super().send_mail(subject_template_name, email_template_name,
                          context, effective_from_email, to_email, html_email_template_name)

    def get_users(self, email):
        # There could be multiple user records for the same email
        # There's no need to email the same box multiple times
        try:
            first_user = next(super().get_users(email))
        except StopIteration:
            return []
        return [first_user]
