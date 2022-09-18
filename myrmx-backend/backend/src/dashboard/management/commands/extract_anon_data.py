from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand
from django.db.models.query import QuerySet
from faker import Faker

from api.models import PeerToPeerMessage
from dashboard.models import (
    Company, Roadmap, Stage, Competency, ActionItemGlobal, QuestionGlobal, ContentGlobal, Cohort,
    User, ActionItemAssessment, FollowUpItem, QuestionAnswer, ContentResponse, Assessment, Comment, Note,
    RoadmapAssignment, AssignedRoadmap,
)
from notifications.models import new_notification
from notifications.signals import notify


def _copy_m2m_field(instance, m2m_list, m2m_man_getter, model, target_db):
    for m2m_instance in m2m_list:
        m2m_man_getter(instance).add(model.objects.using(target_db).get(id=m2m_instance.id))


def _anonymize_text_field(faker, instance, field):
    text_value = getattr(instance, field)
    anonymized_text = ''
    if text_value:
        anonymized_text = faker.text(len(text_value)) if len(text_value) >= 5 else 'foo'
    setattr(instance, field, anonymized_text)


def _process_company(_, company: Company, options):
    target_db = options['target_db']
    company.logo = ''
    company.save(using=target_db)


def _get_single_text_field_anonymizing_instance_processor(field):
    def instance_processor(faker, instance, options):
        target_db = options['target_db']
        _anonymize_text_field(faker, instance, field)
        instance.save(using=target_db)
    return instance_processor


def _process_cohort(_, cohort: Cohort, options):
    target_db = options['target_db']
    cohort_roadmaps = list(cohort.roadmaps.all())
    cohort.save(using=target_db)
    _copy_m2m_field(cohort, cohort_roadmaps, lambda c: c.roadmaps, Roadmap, target_db)


def _process_ai_global(_, ai: ActionItemGlobal, options):
    target_db = options['target_db']
    ai.aiAttachment = ''
    ai.save(using=target_db)


def _process_coach(faker, user: User, options):
    target_db = options['target_db']
    user_groups = list(user.groups.all())
    user_roadmaps = list(user.roadmaps.all())
    user_archived_roadmaps = list(user.archived_roadmaps.all())
    user_cohorts = list(user.cohort.all())
    if user.first_name:
        user.first_name = faker.first_name()
    if user.last_name:
        user.last_name = faker.last_name()
    if user.email:
        user.email = faker.email()
    if user.phone_number:
        user.phone_number = faker.phone_number()[0:15]
    _anonymize_text_field(faker, user, 'bio')
    user.photo = ''
    _anonymize_text_field(faker, user, 'notes_for_coach')
    _anonymize_text_field(faker, user, 'coach_notes_regarding_student')
    user.password = ''
    user.save(using=target_db)
    _copy_m2m_field(user, user_groups, lambda u: u.groups, Group, target_db)
    _copy_m2m_field(user, user_roadmaps, lambda u: u.roadmaps, Roadmap, target_db)
    _copy_m2m_field(user, user_archived_roadmaps, lambda u: u.archived_roadmaps, Roadmap, target_db)
    _copy_m2m_field(user, user_cohorts, lambda u: u.cohort, Cohort, target_db)


def _process_user(faker, user: User, options):
    target_db = options['target_db']
    user_coaches = list(user.coach.all())
    _process_coach(faker, user, options)
    _copy_m2m_field(user, user_coaches, lambda u: u.coach, User, target_db)


def _process_ai(faker, ai: ActionItemAssessment, options):
    target_db = options['target_db']
    _anonymize_text_field(faker, ai, 'notes')
    ai.assessmentAttachment = ''
    ai.assessmentScreen = ''
    ai.assessmentAudio = ''
    ai.save(using=target_db)


class Command(BaseCommand):
    help = '''Extracts data from source DB to target DB and anonymizes it along the way.
    CAUTION! This will erase any data in target DB overlapping with source DB!'''

    def add_arguments(self, parser):
        parser.add_argument('source_db', type=str, help='Name of the source DB in DATABASES setting')
        parser.add_argument('target_db', type=str, help='Name of the target DB in DATABASES setting')

    def handle(self, *app_labels, **options):
        faker = Faker()
        source_db = options['source_db']
        target_db = options['target_db']
        notify.disconnect(new_notification)
        self.stdout.write(f'Extracting from "{source_db}" to "{target_db}"...')

        _process_competency = _get_single_text_field_anonymizing_instance_processor('coach_notes')
        # Caution! Order here matters
        self._copy_model(faker, Group, options)
        self._copy_model(faker, Company, options, _process_company)
        self._copy_model(faker, Roadmap, options)
        self._copy_model(faker, Stage, options, _get_single_text_field_anonymizing_instance_processor('coach_notes'))
        self._copy_model(faker, Competency.objects.filter(student__isnull=True), options, _process_competency)
        self._copy_model(faker, Cohort, options, _process_cohort)
        self._copy_model(faker, ActionItemGlobal, options, _process_ai_global)
        self._copy_model(faker, QuestionGlobal, options)
        self._copy_model(faker, ContentGlobal, options)
        self._copy_model(faker, User.objects.filter(groups__name='Coach'), options, _process_coach)
        self._copy_model(faker, User.objects.exclude(groups__name='Coach'), options, _process_user)
        self._copy_model(faker, Competency.objects.filter(student__isnull=False), options, _process_competency)
        self._copy_model(faker, ActionItemAssessment, options, _process_ai)
        self._copy_model(faker, FollowUpItem, options, _get_single_text_field_anonymizing_instance_processor('notes'))
        self._copy_model(faker, QuestionAnswer, options,
                         _get_single_text_field_anonymizing_instance_processor('answer'))
        self._copy_model(faker, ContentResponse, options)
        self._copy_model(faker, Comment, options, _get_single_text_field_anonymizing_instance_processor('text'))
        self._copy_model(faker, Note, options, _get_single_text_field_anonymizing_instance_processor('text'))
        self._copy_model(faker, RoadmapAssignment, options)
        self._copy_model(faker, AssignedRoadmap, options)
        self._copy_model(faker, PeerToPeerMessage.objects.filter(latest=True), options,
                         _get_single_text_field_anonymizing_instance_processor('text'))
        self._copy_assessments(faker, options)

        self.stdout.write(f'Data from "{source_db}" to "{target_db}" extracted successfully!')

    def _copy_model(self, faker, model_or_qs, options, instance_processor=None):
        source_db = options['source_db']
        target_db = options['target_db']
        model_qs = model_or_qs.using(source_db) if isinstance(model_or_qs, QuerySet) \
            else model_or_qs.objects.using(source_db).all()
        model_name = model_or_qs.model.__name__ if isinstance(model_or_qs, QuerySet) else model_or_qs.__name__
        items_count = model_qs.count()
        qs_to_paginate = model_qs.order_by('id')
        page_size = 1000
        offset = 0
        while offset < items_count:
            rest_of_items_count = page_size if items_count - offset >= page_size else items_count - offset
            self.stdout.write(f"Copying {model_name} instances from {offset} to {offset + rest_of_items_count}")
            current_page = qs_to_paginate[offset:offset + page_size]
            for instance in current_page:
                if instance_processor:
                    instance_processor(faker, instance, options)
                else:
                    instance.save(using=target_db)
            offset += page_size

    def _copy_assessments(self, faker, options):
        source_db = options['source_db']
        target_db = options['target_db']
        students_qs = User.objects.using(target_db).filter(groups__name="User")
        students_count = students_qs.count()
        students_qs_to_paginate = students_qs.order_by('id')
        page_size = 1000
        offset = 0
        while offset < students_count:
            rest_of_items_count = page_size if students_count - offset >= page_size else students_count - offset
            self.stdout.write(f"Copying assessments of students from {offset} to {offset + rest_of_items_count}")
            current_page = students_qs_to_paginate[offset:offset + page_size]
            for student in current_page:
                assessment = Assessment.objects.using(source_db).filter(student_id=student.id).order_by('-id').first()
                if assessment:
                    assessment.save(using=target_db)
            offset += page_size
