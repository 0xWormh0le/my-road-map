from __future__ import unicode_literals
import datetime
import hashlib
import os
import random
import string

from ckeditor.fields import RichTextField
from django.conf import settings
from django.contrib.auth.models import AbstractUser, Group
from django.core.exceptions import ValidationError
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.db import models, IntegrityError, transaction, connection
from django.db.models.signals import post_save
from django.shortcuts import get_object_or_404, reverse
from django.utils.timezone import timedelta, now
from django.utils import timezone

from multiselectfield import MultiSelectField

DEFAULT_PROFILE_PICTURE_URL = 'https://s3-us-west-2.amazonaws.com/myroadmap.io/images/profiles/nobody.jpg'
DEFAULT_ROADMAP_ICON_URL = 'https://image.flaticon.com/icons/svg/149/149223.svg'
URL_MAX_LENGTH = 1024
TIMEDELTA = timedelta(days=30)


class ActionItemAssessment(models.Model):
    competency = models.ForeignKey('Competency', null=True, blank=True, on_delete=models.CASCADE)
    description = models.TextField(blank=True, default='')
    due_date = models.DateField(null=True, blank=True)
    parent = models.ForeignKey('ActionItemGlobal', on_delete=models.CASCADE, blank=True, null=True)
    student = models.ForeignKey('User', related_name='+', on_delete=models.CASCADE)
    send_follow_up_email_on_due_date = models.BooleanField(default=True, blank=True)
    marked_done = models.BooleanField(default=False)
    date_marked_done = models.DateField(blank=True, null=True)
    approved_done = models.BooleanField(default=False)
    date_approved_done = models.DateField(blank=True, null=True)
    archived = models.BooleanField(default=False)
    notes = models.TextField(max_length=1024, null=True, blank=True)
    order = models.IntegerField(default=0)
    assessmentAttachment = models.FileField(upload_to='assessment_files/', blank=True)
    assessmentScreen = models.FileField(upload_to='assessment_files/', blank=True)
    assessmentAudio = models.FileField(upload_to='assessment_files/', blank=True)

    class Meta:
        unique_together = (('student', 'parent'),)

    def __str__(self):
        try:
            d = self.parent.aiTitle
        except:
            d = self.description
        return d

    @property
    def is_past_due(self):
        if self.parent:
            return False
        else:
            if datetime.date.today() > self.due_date:
                return True
            return False

    @property
    def company(self):
        return self.competency.roadmap.company

    @property
    def is_due_today(self):
        if self.parent:
            return False
        else:
            if datetime.date.today() == self.due_date:
                return True
            return False

    @property
    def is_urgent(self):
        if self.parent:
            return False
        if not self.marked_done and self.is_past_due and not self.archived:
            return True
        return False

    @property
    def effective_description(self):
        return self.parent.aiDescription if self.parent else self.description

    @effective_description.setter
    def effective_description(self, value):
        if self.parent:
            return
        self.description = value


class ActionItemGlobal(models.Model):
    competency = models.ForeignKey('Competency', limit_choices_to={'student': None}, on_delete=models.CASCADE)
    aiTitle = models.TextField(max_length=200, default='')
    # description = models.TextField(max_length=200)
    aiDescription = RichTextField(config_name='default', blank=True)
    due_date = models.DateField(blank=True, null=True)
    date_created = models.DateField(default=timezone.now)
    cohort = models.ManyToManyField('Cohort', blank=True,
                                    help_text="Select specific Groups that this Action Item applies to. Or leave blank if it should apply to all Cohorts, including any future Cohorts.")
    order = models.IntegerField(default=0)
    category = models.TextField(max_length=1024, blank=True)
    required = models.BooleanField(default=False)
    hidden = models.BooleanField(default=False)
    aiAttachment = models.FileField(upload_to='ai_files/', blank=True)

    RESOLUTIONS = (
        ('mark_complete', 'mark complete'),
        ('requires_approval', 'requires approval'),
        ('attach_file', 'attach file'),
        ('attach_screen_recording', 'attach screen recording'),
        ('input_text', 'input text'),
        ('attach_audio_recording', 'attach audio recording'),
    )

    resolutions = MultiSelectField(choices=RESOLUTIONS, null=True, blank=True)

    class Meta:
        verbose_name = "Action Item"
        verbose_name_plural = "Action Items"

    def __str__(self):
        d = self.aiTitle
        if d is None:
            return "(no title)"
        return d


class FollowUpItem(models.Model):
    due_date = models.DateField(null=True, blank=True)
    student = models.ForeignKey('User', related_name='+', on_delete=models.CASCADE)
    contacted = models.BooleanField(default=False)
    attempted_to_contact = models.BooleanField(default=False)
    no_attempt_to_contact = models.BooleanField(default=False)
    marked_done = models.BooleanField(default=False)
    date_marked_done = models.DateField(blank=True, null=True)
    notes = models.TextField(max_length=2024, null=True, blank=True)
    archived = models.BooleanField(default=False)

    @property
    def is_past_due(self):
        if datetime.date.today() > self.due_date:
            return True
        return False

    @property
    def is_due_today(self):
        if datetime.date.today() == self.due_date:
            return True
        return False

    @property
    def is_urgent(self):
        if not self.marked_done and self.is_past_due and not self.archived:
            return True
        return False


class QuestionAnswer(models.Model):
    competency = models.ForeignKey('Competency', null=True, blank=True, on_delete=models.CASCADE)
    parent = models.ForeignKey('QuestionGlobal', on_delete=models.CASCADE, blank=True, null=True)
    student = models.ForeignKey('User', related_name='+', on_delete=models.CASCADE)
    answer = models.TextField(max_length=1024, null=True, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        unique_together = (('student', 'parent'),)


class QuestionGlobal(models.Model):
    competency = models.ForeignKey('Competency', limit_choices_to={'student': None}, on_delete=models.CASCADE)
    description = models.TextField(max_length=1024, blank=True)
    question = models.TextField(max_length=1024)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Question"
        verbose_name_plural = "Questions"

    def __str__(self):
        return self.question


class ContentResponse(models.Model):
    competency = models.ForeignKey('Competency', null=True, blank=True, on_delete=models.CASCADE)
    parent = models.ForeignKey('ContentGlobal', on_delete=models.CASCADE, blank=True, null=True)
    student = models.ForeignKey('User', related_name='+', on_delete=models.CASCADE)
    response = RichTextField(config_name='default', null=True, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        unique_together = (('student', 'parent'),)


class ContentGlobal(models.Model):
    competency = models.ForeignKey('Competency', limit_choices_to={'student': None}, on_delete=models.CASCADE)
    title = models.CharField(max_length=1024)
    description = models.TextField(max_length=1024, blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class Assessment(models.Model):
    GREY = '0'
    RED = '1'
    YELLOW = '2'
    GREEN = '3'
    STATUS_CHOICES = (
        (GREY, 'Grey'),
        (RED, 'Red'),
        (YELLOW, 'Yellow'),
        (GREEN, 'Green')
    )
    student = models.ForeignKey('User', related_name='+', on_delete=models.CASCADE)
    user = models.ForeignKey('User', related_name='+', on_delete=models.CASCADE)
    reviewer = models.ForeignKey('User', related_name='+', on_delete=models.CASCADE, blank=True, null=True)
    status = models.CharField(
        max_length=1,
        choices=STATUS_CHOICES,
        default=RED,
    )
    competency = models.ForeignKey('Competency', on_delete=models.CASCADE)
    date = models.DateField(default=datetime.date.today)
    comment = models.TextField(blank=True)
    approved = models.BooleanField(default=True)
    rejected = models.BooleanField(default=False)
    review_date = models.DateField(blank=True, null=True)
    slider_status = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.competency.title

    def get_target_id(self):
        return str(self.competency.pk)

    def get_target_user(self):
        return str(self.student.id)

    def is_grey(self):
        return self.status == self.GREY

    def is_red(self):
        return self.status == self.RED

    def is_yellow(self):
        return self.status == self.YELLOW

    def is_green(self):
        return self.status == self.GREEN


class Cohort(models.Model):
    name = models.CharField(max_length=256, null=True, blank=True)
    company = models.ForeignKey('Company', blank=True, null=True, on_delete=models.CASCADE)
    signup_url = models.SlugField(null=True, blank=True, unique=True)
    description = models.TextField(blank=True)
    roadmaps = models.ManyToManyField('Roadmap', related_name='roadmaps', blank=True)
    created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name if self.name else ''

    def get_coach_count(self):
        return len([user for user in User.objects.filter(cohort=self) if user.is_coach()])

    def get_student_count(self):
        return len([user for user in User.objects.filter(cohort=self) if user.is_student()])

    def get_admin_count(self):
        return len([user for user in User.objects.filter(cohort=self) if user.is_admin()])


class Comment(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    competency = models.ForeignKey('Competency', related_name='comments', on_delete=models.CASCADE)
    student = models.ForeignKey('User', related_name='+', on_delete=models.CASCADE)
    date = models.DateTimeField()
    text = models.TextField()

    def __str__(self):
        return self.text

    def get_target_id(self):
        return str(self.competency_id)

    def get_target_user(self):
        return str(self.student.id)


class Note(models.Model):
    competency = models.ForeignKey('Competency', related_name="notes", on_delete=models.CASCADE)
    student = models.ForeignKey('User', related_name='+', on_delete=models.CASCADE)
    text = models.TextField()


class Company(models.Model):
    LIGHT_THEME = 'light'
    DARK_THEME = 'dark'
    BLUE_OCEAN_THEME = 'blue-ocean'

    THEME_CHOICES = (
        (LIGHT_THEME, 'Light'),
        (DARK_THEME, 'Dark'),
        (BLUE_OCEAN_THEME, 'Blue Ocean'),
    )

    name = models.CharField(max_length=255, null=True, unique=True)
    logo = models.FileField(upload_to='images/company-logos/', blank=True)
    private_labeled = models.BooleanField(default=False, blank=True)
    requires_approval = models.BooleanField(default=False, blank=True)
    user_can_asssign_roadmaps = models.BooleanField(default=False, blank=True)
    coach_can_asssign_roadmaps = models.BooleanField(default=True, blank=True)
    group_specific_roadmaps = models.BooleanField(default=False, blank=True)
    users_can_attach_files = models.BooleanField(default=True, blank=True)
    coach_notes = models.BooleanField(default=False, blank=True)
    competency_notes_journal_section = models.BooleanField(default=True, blank=True)
    conversations = models.BooleanField(default=False, blank=False)
    users_can_assign_specific_coaches_for_specific_roadmaps = models.BooleanField(default=False, blank=False)
    follow_up_schedule = models.BooleanField(default=False, blank=True)
    users_can_assign_coach = models.BooleanField(default=False, blank=True)
    coach_synonym = models.CharField(max_length=50, blank=True, null=True, default="Coach")
    user_synonym = models.CharField(max_length=50, blank=True, default="User")
    terms_and_conditions = models.CharField(max_length=500, blank=True, null=True)
    privacy_policy = models.CharField(max_length=500, blank=True, null=True)
    users_can_erase_their_account = models.BooleanField(default=False, blank=False)
    archive_roadmaps = models.BooleanField(default=False, blank=False)
    coach_admin_assign_user_specifc_objectives = models.BooleanField(default=False, blank=True)
    coach_admin_edit_visibility_user_objectives = models.BooleanField(default=False, blank=True)
    hide_roadmaps_from_users = models.BooleanField(default=False, blank=True)
    pin_roadmaps_for_users = models.BooleanField(default=False, blank=True)
    assign_roadmaps_to_all_users = models.BooleanField(default=False, blank=True)
    users_can_add_action_items = models.BooleanField(default=True, blank=True)
    coaches_admin_can_assess_objectives = models.BooleanField(default=False, blank=True)
    show_print_competency_detail_button = models.BooleanField(default=False, blank=True)
    email_welcome_message = models.TextField(max_length=2048, blank=True, null=True)
    app_welcome_message = models.TextField(max_length=2048, blank=True, null=True, default="Select a Roadmap below to get started.")
    default_red_assessment = models.TextField(max_length=2048, blank=True, default="")
    default_yellow_assessment = models.TextField(max_length=2048, blank=True, default="")
    default_green_assessment = models.TextField(max_length=2048, blank=True, default="")
    default_red_assessment_prompt = models.TextField(max_length=2048, blank=True, default="")
    default_yellow_assessment_prompt = models.TextField(max_length=2048, blank=True, default="")
    default_green_assessment_prompt = models.TextField(max_length=2048, blank=True, default="")
    assessment_synonym = models.CharField(max_length=100, blank=True, null=True, default="Assessment")
    coaches_approve_green_assessments = models.BooleanField(default=True, blank=True)
    default_theme = models.CharField(max_length=32, choices=THEME_CHOICES, blank=True)
    users_can_invite_coach = models.BooleanField(default=False, blank=True)
    slider_for_competency_assessment = models.BooleanField(default=False)
    from_email = models.EmailField(
        blank=True, help_text='Format: support@myroadmap.io, will be prepended with the company name, '
                              'i.e. MyRoadmap &lt;support@myroadmap.io&gt;')
    legal_address = models.CharField(max_length=512, blank=True)
    django_frontend_base_url = models.URLField(blank=True, help_text='Format: https://app.myroadmap.io')
    react_frontend_base_url = models.URLField(blank=True, help_text='Format: https://react-app.myroadmap.io')

    class Meta:
        verbose_name_plural = 'Companies'

    def __str__(self):
        return self.name

    @property
    def total_users(self):
        return User.objects.filter(company_id=self.id, groups__name='User').count()

    @property
    def total_coaches(self):
        return User.objects.filter(company_id=self.id, groups__name='Coach').count()

    @property
    def total_roadmaps(self):
        return Roadmap.objects.filter(company_id=self.id).count()

    @property
    def users_with_roadmaps(self):
        return User.objects.filter(company_id=self.id, groups__name='User').exclude(roadmaps=None).count()

    @property
    def users_with_roadmaps_percent(self):
        if self.total_users:
            return int(self.users_with_roadmaps/self.total_users*100)
        else:
            return 0

    @property
    def users_with_coaches(self):
        return User.objects.filter(company_id=self.id, groups__name='User').exclude(coach=None).count()

    @property
    def users_with_coaches_percent(self):
        if self.total_users:
            return int(self.users_with_coaches/self.total_users*100)
        else:
            return 0

    @property
    def monthly_users_approved(self):
        return Assessment.objects.filter(student_id__company_id=self.id, review_date__range=[now()-TIMEDELTA, now()], approved=1).count()

    @property
    def monthly_users_approved_percent(self):
        if self.total_users:
            return int(self.monthly_users_approved/self.total_users*100)
        else:
            return 0

    @property
    def active_users_count(self):
        return User.objects.filter(company_id=self.id, last_login__range=[now()-TIMEDELTA, now()], groups__name='User').count() #or is_active=True

    @property
    def active_users_percent(self):
        if self.total_users:
            return int(self.active_users_count/self.total_users*100)
        else:
            return 0

    @property
    def active_coaches_count(self):
        return User.objects.filter(company_id=self.id, last_login__range=[now()-TIMEDELTA, now()], groups__name='Coach').count()

    @property
    def active_coaches_percent(self):
        if self.total_coaches:
            return int(self.active_coaches_count/self.total_coaches*100)
        else:
            return 0


class Competency(models.Model):
    """Objectives"""
    parent = models.ForeignKey('self', blank=True, null=True, related_name='competency_parent', on_delete=models.CASCADE)
    stage = models.ForeignKey('Stage', on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    coach_notes = models.TextField(max_length=2048, blank=True)
    description = RichTextField(config_name='default', blank=True, null=True)
    red_description = models.CharField(max_length=1000, blank=True)
    yellow_description = models.CharField(max_length=1000, blank=True)
    green_description = models.CharField(max_length=1000, blank=True)
    student = models.ForeignKey('User', blank=True, null=True,
                                help_text="This is a helper variable, don't change it.", on_delete=models.CASCADE)
    hidden_for = models.ManyToManyField('User', related_name='hidden_for', blank=True)
    hidden_for_all_users = models.BooleanField(default=False, blank=False)
    order = models.IntegerField(blank=True, null=True)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)
    user_defined = models.BooleanField(default=False, blank=True)
    comments_visible = models.BooleanField(default=True, blank=True)
    ai_visible = models.BooleanField(default=True, blank=True)
    attachments_visible = models.BooleanField(default=True, blank=True)
    daily_assessment = models.BooleanField(default=False, blank=False)
    daily_assessment_question = models.CharField(max_length=2000, blank=True)
    daily_assessment_red = models.CharField(max_length=2000, blank=True)
    daily_assessment_yellow = models.CharField(max_length=2000, blank=True)
    daily_assessment_green = models.CharField(max_length=2000, blank=True)




    content = RichTextField(config_name='default', blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Competencies'

    @property
    def is_global(self):
        if self.student:
            return False
        return True

    @property
    def title_with_stage_without_roadmap(self):
        return str(self.stage.title)

    @property
    def roadmap(self):
        return self.stage.roadmap

    def __str__(self):
        return '{} - {}'.format(self.stage, self.title)

    def get_absolute_url(self):
        return reverse('competency', kwargs={'pk': self.pk})

    def get_target_id(self):
        return str(self.pk)

    def get_parent(self):
        the_parent = self
        if self.parent:
            the_parent = self.parent
        return the_parent

    def get_children(self):
        parent = self.get_parent()
        qs = Competency.objects.filter(parent=parent)
        # qs_parent = Competency.objects.filter(pk=parent.pk)
        # return (qs | qs_parent)
        return (qs)

    def get_comments(self, student_id):
        return self.comments.filter(student_id=student_id).all()

    def has_video_content(self):
        if self.content:
            return True if 'data-oembed-url' in self.content else False
        return False

    def has_text_content(self):
        if self.content:
            return True if '<p>' in self.content else False
        return False

class RoadmapAssignment(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    roadmap = models.ForeignKey('Roadmap', on_delete=models.CASCADE)
    date_assigned = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return '%s - %s - %s' % (self.user, self.roadmap, self.date_assigned)

class Roadmap(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=1000, null=True, blank=True)
    company = models.ForeignKey(Company, blank=True, null=True, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=False, blank=True)
    icon = models.FileField(upload_to='images/roadmap_icons/', blank=True)
    cohorts = models.ManyToManyField('Cohort', related_name='cohorts', blank=True)
    pinned = models.BooleanField(default=False, blank=True)
    assign_to_all_users = models.BooleanField(default=False, blank=True)
    hidden_from_users = models.BooleanField(default=False, blank=True)
    users_can_edit_ai = models.BooleanField(default=True, blank=True)
    users_can_edit_content = models.BooleanField(default=True, blank=True)
    simplified_ai = models.BooleanField(default=False, blank=True)

    class Meta:
        ordering = ('pinned',)


    def __str__(self):
        return self.title

    def get_user_count(self):
        return User.objects.filter(roadmaps__id=self.id).count()

    def get_roadmap_icon_url(self):
        return self.icon.url if self.icon else DEFAULT_ROADMAP_ICON_URL

class Stage(models.Model):
    title = models.CharField(max_length=64,
                             help_text="Title should be in the format 'Stage X: What it focues on' ... i.e. 'Stage 1: Learn'.")
    coach_notes = models.TextField(max_length=2048, blank=True)
    description = models.TextField(max_length=256, null=True, blank=True)
    roadmap = models.ForeignKey(Roadmap, blank=True, null=True, on_delete=models.CASCADE)
    order = models.IntegerField(blank=True, null=True, help_text="")
    hidden_from_users = models.BooleanField(default=False, blank=True)

    def __str__(self):
        if self.roadmap:
            return '({}) {}'.format(self.roadmap, self.title)
        return self.title

class AssignedRoadmap(models.Model):
    roadmap = models.ForeignKey(Roadmap, blank=True, null=True, on_delete=models.CASCADE)
    student = models.ForeignKey('User', related_name="assigned_student", blank=True, null=True, on_delete=models.CASCADE)
    coach = models.ForeignKey('User', related_name="assigned_coach", blank=True, null=True, on_delete=models.CASCADE)

    @property
    def coach_initials(self):
        xs = (str(self.coach))
        name_list = xs.split()

        initials = ""

        for name in name_list:  # go through each name
            initials += name[0].upper()  # append the initial

        return initials

class AssignedCompany(models.Model):
    company = models.ForeignKey(Company, blank=True, null=True, on_delete=models.CASCADE)
    groups = models.ManyToManyField(Group, blank=True)
    is_approved = models.BooleanField(default=False, blank=True)
    cohort = models.ManyToManyField(Cohort, blank=True)


class User(AbstractUser):
    """ This comes from the AbstractUser class
    id
    password
    last_login
    is_superuser
    username
    first_name
    last_name
    is_staff
    is_active
    date_joined
    """
    email = models.EmailField(null=True)
    mentors = models.ManyToManyField('User', related_name='+', blank=True, limit_choices_to={'groups__name': 'Mentor'})
    roadmaps = models.ManyToManyField('Roadmap', related_name='users', blank=True)
    assigned_roadmaps = models.ManyToManyField('AssignedRoadmap', related_name='assigned_users', blank=True)
    archived_roadmaps = models.ManyToManyField('Roadmap', related_name="archived_roadmaps", blank=True)
    coach = models.ManyToManyField('self', related_name='students', symmetrical=False, blank=True, limit_choices_to={'groups__name': 'Coach'})
    # These are called groups in the interface
    cohort = models.ManyToManyField(Cohort, blank=True, related_name='users', help_text='Users should only be in ONE group. Mentor can be in multiple groups.')
    is_approved = models.BooleanField(default=False, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    bio = models.TextField(blank=True)
    # resume = models.FileField(upload_to='documents/resumes/', blank=True)
    photo = models.FileField(upload_to='images/profiles/', blank=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    sidebar_list = models.CharField(max_length=500, blank=True, null=True)
    last_downloaded_competencies = models.DateTimeField(null=True, blank=True)
    notes_for_coach = models.TextField(blank=True)
    coach_notes_regarding_student = models.TextField(blank=True)
    # assigned_companies = models.ManyToManyField('AssignedCompany', related_name='assigned_company_users', blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    # companies = models.ManyToManyField(Company, blank=True, related_name='company_users')
    facebook_id = models.CharField(max_length=255, blank=True)
    google_id = models.CharField(max_length=255, blank=True)
    unsubscribed = models.BooleanField(default=False)
    valid_email = models.BooleanField(default=True)

    _group_names = None

    class Meta:
        unique_together = ('email', 'company')

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)

    @property
    def is_online(self):
        if self.last_seen:
            elapsed = now() - self.last_seen
            if elapsed < datetime.timedelta(minutes=10):
                return True
        return False

    @property
    def group_names(self):
        if self._group_names is None:
            self._group_names = set(self.groups.values_list('name', flat=True))
        return self._group_names

    def is_company_admin(self):
        return not self.cohort.exists() and 'Admin' in self.group_names

    def is_cohort_admin(self, cohort=None):
        if 'Admin' in self.group_names:
            if cohort:
                return cohort in self.cohort.all()
            else:
                return self.cohort.exists()
        return False

    def can_edit_template(self, roadmap=None):
        if 'Admin' in self.group_names:
            return True
            # for cohort in roadmap.cohorts.all():
            #     if self.is_cohort_admin(cohort):
            #         return True
        return False

    def can_access_user(self, user):
        if self == user or self.is_superuser:
            return True
        elif self.is_admin() and user.company == self.company:
            return True
        elif self.is_coach() and user.coach.filter(id=self.id).exists():
            return True
        print("Unauthorized user. Access not granted.")
        return False

    def is_student(self):
        return 'User' in self.group_names

    def is_coach(self):
        return 'Coach' in self.group_names

    def is_admin(self):
        return 'Admin' in self.group_names

    def is_mentor(self):
        return 'Mentor' in self.group_names

    def get_photo_url(self):
        return self.photo.url if self.photo else DEFAULT_PROFILE_PICTURE_URL

    def get_students(self):
        company_users = User.objects.filter(company=self.company)
        students = company_users.filter(coach=self)
        return students

    def get_current_assigned_roadmaps(self, roadmap_id=None):
        # only show assigned roadmaps for current coaches
        current_assigned_roadmaps = []
        coaches = User.objects.filter(groups__name="Coach", company=self.company).distinct()
        for coach in coaches:
            if roadmap_id:
                for assigned_roadmap in self.assigned_roadmaps.filter(student=self, roadmap=roadmap_id):
                    if coach == assigned_roadmap.coach:
                        current_assigned_roadmaps.append(assigned_roadmap)
            else:
                for assigned_roadmap in self.assigned_roadmaps.filter(student=self):
                    if coach == assigned_roadmap.coach:
                        current_assigned_roadmaps.append(assigned_roadmap)
        return current_assigned_roadmaps

    @staticmethod
    def get_unsubscribe_token(user_id):
        return hashlib.sha256(f'{user_id}{settings.SECRET_KEY}'.encode()).hexdigest()

    @staticmethod
    def update_unsubscribed(user_id, token, unsubscribe=True):
        if User.get_unsubscribe_token(user_id) == token:
            user = get_object_or_404(User, pk=user_id)
            user.unsubscribed = unsubscribe
            user.save()

    @property
    def companies(self):
        if not self.email:
            return [self.company]
        return list(filter(lambda c: bool(c), map(lambda u: u.company, User.objects.filter(email=self.email))))

    _field_names_to_sync = ['email', 'password', 'is_superuser', 'valid_email']

    def save(self, *args, **kwargs):
        perform_sync = kwargs.pop('perform_sync', True)
        current_email = None
        if perform_sync:
            db_instance = User.objects.get(pk=self.pk) if self.pk else None
            current_email = (db_instance.email if db_instance else None) or self.email
        super().save(*args, **kwargs)
        if not perform_sync or not current_email:
            return
        for other_user in User.objects.filter(email=current_email):
            if other_user == self:
                continue
            for f in self._field_names_to_sync:
                setattr(other_user, f, getattr(self, f))
            other_user.save(perform_sync=False)

    # TODO: This method is for compatibility purposes while AssignedCompany model exists & companies M2M field
    def delete(self, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("""
                select dac.id from dashboard_assignedcompany dac
                inner join dashboard_user_assigned_companies duac on dac.id = duac.assignedcompany_id
                inner join dashboard_user du on duac.user_id = du.id
                where du.id = %s;""", (self.pk,))
            assigned_companies_results = cursor.fetchall()
            cursor.execute("""
                select dc.id from dashboard_company dc
                inner join dashboard_user_companies duc on dc.id = duc.company_id
                inner join dashboard_user du on duc.user_id = du.id
                where du.id = %s;""", (self.pk,))
            companies_results = cursor.fetchall()
        with transaction.atomic():
            if len(assigned_companies_results) > 0:
                assigned_companies_ids = [t[0] for t in assigned_companies_results]
                with connection.cursor() as cursor:
                    cursor.execute(
                        "delete from dashboard_user_assigned_companies where user_id = %s and assignedcompany_id in %s;",
                        (self.pk, tuple(assigned_companies_ids),),
                    )
                AssignedCompany.objects.filter(pk__in=assigned_companies_ids).delete()
            if len(companies_results) > 0:
                companies_ids = [t[0] for t in companies_results]
                with connection.cursor() as cursor:
                    cursor.execute(
                        "delete from dashboard_user_companies where user_id = %s and company_id in %s;",
                        (self.pk, tuple(companies_ids),),
                    )
            super().delete(*args, **kwargs)

    def full_clean(self, exclude=None, validate_unique=True):
        super().full_clean(exclude, validate_unique)
        db_instance = User.objects.get(pk=self.pk) if self.pk else None
        current_email = (db_instance.email if db_instance else None) or self.email
        user_company_ids = list(User.objects.filter(email=current_email).values_list('pk', 'company_id'))
        for user_id, company_id in user_company_ids:
            if User.objects.filter(email=self.email, company=company_id).exclude(pk=user_id).exists():
                raise ValidationError({'email': ["User with the email specified already exists", ]})


class Attachment(models.Model):
    SCREEN_FILE_CATEGORY = 'SCREEN'
    AUDIO_FILE_CATEGORY = 'AUDIO'
    ATTACHMENT_FILE_CATEGORY = 'ATTACHMENT'

    FILE_CATEGORY_CHOICES = (
        (SCREEN_FILE_CATEGORY, 'Screen'),
        (AUDIO_FILE_CATEGORY, 'Audio'),
        (ATTACHMENT_FILE_CATEGORY, 'Attachment'),
    )

    user = models.ForeignKey('User', on_delete=models.CASCADE, null=True, blank=True)
    competency = models.ForeignKey('Competency', related_name="attachments", on_delete=models.CASCADE)
    attachment = models.FileField(upload_to='attachments/', blank=True)
    attacher = models.ForeignKey('User', related_name='attacher', on_delete=models.SET_NULL, null=True)
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=255, null=True, blank=True)
    date_attached = models.DateTimeField(null=True, blank=True)
    actionItem = models.ForeignKey(
        'ActionItemAssessment', related_name="attachments", on_delete=models.CASCADE, blank=True, null=True)
    file_category = models.CharField(max_length=16, choices=FILE_CATEGORY_CHOICES, blank=True)
    external_url = models.URLField(blank=True)

    def init_file_name_and_type(self, filename):
        self.filename = filename
        ext = os.path.splitext(filename)[1].lower()
        if ext == '.mov':
            self.filename = os.path.splitext(self.filename)[0] + '.mp4'
            self.filename.replace(".mov", ".mp4")
        else:
            self.filename = self.filename
        if self.filename.lower().endswith(
                ('.png', 'jpg', 'jpeg', '.ai', '.bmp', '.gif', '.ico', '.psd', '.svg', '.tiff', '.tif')):
            self.file_type = "image"
        if self.filename.lower().endswith(
                ('.mp4', '.mov', '.3g2', '.avi', '.flv', '.h264', '.m4v', '.mpg', '.mpeg', '.wmv', '.webm')):
            self.file_type = "video"
        if self.filename.lower().endswith(
                ('.aif', '.cda', '.mid', '.midi', '.mp3', '.mpa', '.ogg', '.wav', '.wma', '.wpl')):
            self.file_type = "audio"
        if self.filename.lower().endswith(
                ('.csv', '.dif', '.ods', '.xls', '.tsv', '.dat', '.db', '.xml', '.xlsx', '.xlr')):
            self.file_type = "spreasheet"
        if self.filename.lower().endswith(('.doc', '.pdf', '.rtf', '.txt')):
            self.file_type = "text"
