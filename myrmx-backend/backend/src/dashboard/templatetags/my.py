import datetime

from django import forms, template
from django.contrib.auth.models import Group
from django.utils import timezone, dateformat

from dashboard.models import User, Company


register = template.Library()


@register.filter(name='addcss')
def addcss(field, css):
    if css != 'form-control' or not isinstance(field.field, forms.BooleanField):
        return field.as_widget(attrs={'class': css})
    return field


@register.filter(name='has_group')
def has_group(user, group_name):
    group = Group.objects.get(name=group_name)
    return group in user.groups.all()


@register.simple_tag
def user_assigned_company(user, attr):
    if attr == "groups":
        return list(user.groups.all())
    elif attr == "cohort":
        return list(user.cohort.all())
    elif attr == "coaches":
        coaches = User.objects.filter(groups__name="Coach", company=user.company, students=user).distinct()
        return list(coaches)
    elif attr == "is_coach":
        return "Coach" in user.groups.values_list('name', flat=True)
    elif attr == "is_student":
        return "User" in user.groups.values_list('name', flat=True)
    elif attr == "is_approved":
        return user.is_approved
    else:
        return ValueError(f"Attribute {attr} not supported")


@register.filter
def index(List, i):
    try:
        return List[int(i)]
    except TypeError:
        return None
    except IndexError:
        return None


@register.filter
def get_item(dictionary, key):
    try:
        return dictionary.get(key)
    except IndexError:
        return ''


@register.filter
def get_range(value):
    return range(value) if value is not None else []


@register.filter(name='remove_re')
def remove_re(x):
    if x[0:3] == 'Re:':
        x = x[3:]
    return x


@register.filter(name='remove_brackets_from_me')
def remove_brackets_from_me(x):
    if x == '<me>':
        return 'me'
    return x


@register.filter(name='short_date')
def short_date(dt):
    if not dt:
        return ''
    now = timezone.now()
    if now.year != dt.year:
        return dateformat.format(dt, 'M j, Y')
    else:
        return dateformat.format(dt, 'M j')


@register.filter(name='relative_date')
def relative_date(dt):
    if not dt:
        return ''
    now = timezone.now() if isinstance(dt, datetime.datetime) else timezone.localtime(timezone.now()).date()
    # now = timezone.now()
    # now = timezone.localtime(timezone.now()).date()
    diff = now - dt
    if diff.days > 30:
        if now.year != dt.year:
            return dt.strftime('%b %d, %Y')
        else:
            return dt.strftime('%b %d')
    if diff.days > 7:
        weeks = int(diff.days / 7)
        return '{} week{} ago'.format(weeks, '' if weeks == 1 else 's')
    if diff.days > 1:
        return '{} day{} ago'.format(diff.days, '' if diff.days == 1 else 's')
    if diff.days == 1:
        return 'Yesterday'
    return 'Today'


@register.filter(name='filter_student')
def filter_student(queryset, student_id):
    return queryset.filter(student_id=student_id)


@register.filter(name='change_coach_name')
def change_coach_name(value, coach_synonym):
    return str(value).replace('Coach', coach_synonym)


@register.filter(name='change_user_name')
def change_user_name(value, user_synonym):
    return str(value).replace('User', user_synonym)    


@register.simple_tag
def company_has_dark_ui(company):
    return company.default_theme == Company.DARK_THEME if company else False
