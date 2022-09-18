import re

from django.conf import settings
from django.shortcuts import resolve_url

from dashboard.models import Company
from dashboard.templatetags.my import company_has_dark_ui


def user_groups(request):
    return {
        'user_groups': request.user.group_names if request.user.is_authenticated else []
    }


def is_mobile(request):
    MOBILE_AGENT_RE=re.compile(r".*(iphone|mobile|androidtouch)",re.IGNORECASE)
    if MOBILE_AGENT_RE.match(request.META['HTTP_USER_AGENT']):
        return {'is_mobile': True}
    else:
        return {'is_mobile': False}


def main_nav(request):
    nav_tabs = []

    if request.user.is_authenticated and request.user.is_approved:
        if not request.user.is_superuser:
            nav_tabs.append({'name':'My Roadmaps', 'url': resolve_url('roadmaps')})
        if request.user.is_superuser:
            nav_tabs.append({'name':'Dashboard', 'url': resolve_url('super_dashboard')})
        elif request.user.is_coach() or request.user.is_admin():
            nav_tabs.append({'name':'Dashboard', 'url': resolve_url('dashboard')})
        if request.user.is_admin():
            nav_tabs.append({'name':'Edit Roadmaps', 'url': resolve_url('staff_roadmaps')})
            nav_tabs.append({'name':'Groups', 'url': resolve_url('staff_cohorts')})
        if request.user.is_admin() or request.user.is_superuser:
            nav_tabs.append({'name':'Accounts', 'url': resolve_url('staff_users')})
        if request.user.is_superuser:
            nav_tabs.append({'name':'Companies', 'url': resolve_url('staff_companies')})
    return {
        'nav_tabs': nav_tabs,
    }


def private_company(request):
    private_company = None
    private_id = request.GET.get('private_id') or request.session.get('private_company_id')
    try:
        private_id = int(private_id)
        private_company = Company.objects.filter(id=private_id).first()
        if private_company.id == 1:
            private_company = None
        if private_company:
            request.session['private_company_id'] = private_company.id
    except:
        request.session['private_company_id'] = ''
    return {
        'private_company': private_company
    }


def request_user_company_has_dark_ui(request):
    current_user_company = request.user.company if request.user.is_authenticated else None
    return {
        'request_user_company_has_dark_ui': company_has_dark_ui(current_user_company)
    }


def staging_banner(request):
    return {
        'show_staging_banner': settings.DISPLAY_STAGING_BANNER,
    }
