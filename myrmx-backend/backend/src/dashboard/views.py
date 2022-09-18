from __future__ import division

import datetime
from datetime import date, timedelta
import collections
import json
import logging
import math
import operator
import os
import string
import random
import re
import requests
import urllib.parse
import uuid

from django import forms
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import models, login, logout, update_session_auth_hash, views as auth_views
from django.contrib.auth.decorators import login_required, user_passes_test
# from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.files import File
from django.core.exceptions import ValidationError
from django.db.models import Q, Count
from django.db.models import IntegerField
from django.db.models.functions import Cast
from django.db.transaction import atomic
from django.db.utils import IntegrityError
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404, Http404
from django.template.loader import render_to_string
from django.utils import timezone
from django.urls import reverse, reverse_lazy
from django.views import generic, View
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.edit import UpdateView, FormView
from django.views.generic.list import ListView
from postman.views import WriteView
from rest_framework.mixins import (
    CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin
)
from rest_framework.viewsets import GenericViewSet

from dashboard import aws, util
from .models import User, Stage, Comment, Company, Competency, Assessment, ActionItemAssessment, ActionItemGlobal, Roadmap, Cohort, Note, Attachment, RoadmapAssignment, QuestionGlobal, QuestionAnswer, ContentGlobal, ContentResponse, FollowUpItem, AssignedRoadmap, AssignedCompany
from dashboard.models import User
from .forms import *
from notifications.signals import notify
from notifications.models import Notification
from .serializers import AssessmentSerializer, AuthorizedMixin

# from push_notifications.models import WebPushDevice
from push_notifications.models import WebPushDevice

logger = logging.getLogger(__name__)


def handler404(request, exception=None):
    return render(request, 'registration/404.html', status=404)


def handler500(request):
    return render(request, 'registration/500.html', status=500)


def sendmail(request):
    util.send_email_from_django_frontend(
        'MyRoadmap Profile Approved',
        'Good news! Your profile has been approved. Click on this link to go to your profile and get started.',
        request.user,
        None,
    )
    if is_approved(request.user):
        return HttpResponse('Your profile has been approved')
    else:
        return HttpResponse('Your profile has not been approved')


def is_approved(user):
    return user.is_approved


def not_approved(request):
    if not is_approved(request.user):
        return render(request, 'dashboard/non-approved.html')
    else:
        return redirect('profile')


def log_out(request):
    is_android = request.session.get('android_app')
    is_ios = request.session.get('ios_app')
    if request.user.id and request.user.company and request.user.company.private_labeled:
        private_company_id = request.user.company.id
    else:
        request.session['private_company_id'] = ''
        private_company_id = None

    logout(request)
    if is_android:
        request.session['android_app'] = True
    elif is_ios:
        request.session['ios_app'] = True
    if private_company_id:
        return redirect(reverse('login') + f'?private_id={private_company_id}')
    else:
        return redirect('login')



def get_singular_from_plural(x):
    if len(x) > 2:
        if x[-2:] == 'es':
            return x[:-2]
    return x[:-1]


def get_competencies_for_stage_with_status(user, stage, user_defined=False, hidden_for=[], unread_competency_ids=[]):
    competencies = Competency.objects.filter(
        stage=stage,
        student=user if user_defined else None,
        user_defined=user_defined).order_by('order').exclude(hidden_for=user).distinct()
    competencies_list = []
    reviewers = {}
    latest_assessments = get_latest_assessments_for_competency_ids([c.pk for c in competencies], user)
    for competency in competencies:
        latest_assessment = latest_assessments.get(competency.pk)
        if latest_assessment is not None:
            status = int(latest_assessment['status'])
            status_approved = latest_assessment['approved']
            last_assessed = latest_assessment['date']
            reviewer_id = latest_assessment['reviewer_id']
            if reviewer_id and reviewer_id not in reviewers:
                reviewers[reviewer_id] = User.objects.get(pk=reviewer_id)
            latest_assessment['reviewer'] = reviewers.get(reviewer_id)
        else:
            status = 0
            status_approved = False
            last_assessed = ''
        action_items_total = ActionItemAssessment.objects.filter(student=user, archived=False, competency_id=competency).count()
        global_action_items_total = ActionItemGlobal.objects.filter(competency_id=competency).count
        action_items_done = ActionItemAssessment.objects.filter(
            student=user, marked_done=True, archived=False, competency_id=competency).count()
        competencies_list.append({
            'title': competency.title,
            'content': competency.content,
            'id': competency.pk,
            'user_defined': competency.user_defined,
            'hidden_for': competency.hidden_for,
            'hidden_for_all_users': competency.hidden_for_all_users,
            'status': status,
            'status_approved': status_approved,
            'last_assessed': last_assessed,
            'assessment': latest_assessment,
            'action_items_total': action_items_total,
            'global_action_items_total': global_action_items_total,
            'action_items_done': action_items_done,
            'comment_count': competency.get_comments(user.id).count() if user else 0,
            'has_video': competency.has_video_content(),
            'has_attachments': Attachment.objects.filter(competency=competency),
            'total_attachment_count': Attachment.objects.filter(Q(user=user) | Q(user=None), competency=competency).count(),
            'has_questions': QuestionGlobal.objects.filter(competency=competency),
            'questions_answered_count': QuestionAnswer.objects.filter(competency=competency, student=user, answer__isnull=False).exclude(answer__exact="").count(),
            'question_count_total': QuestionGlobal.objects.filter(competency=competency).count(),
            'has_text_content': competency.has_text_content(),
            'unread_activity': True if competency.id in unread_competency_ids else False
        })

    return competencies_list

def get_competencies_for_roadmap_with_status(user, roadmap, user_defined=False):
    competencies = Competency.objects.filter(
        stage__roadmap=roadmap,
        student=user if user_defined else None,
        user_defined=user_defined).order_by('order').distinct()
    competencies_list = []
    reviewers = {}
    latest_assessments = get_latest_assessments_for_competency_ids([c.pk for c in competencies], user)
    for competency in competencies:
        latest_assessment = latest_assessments.get(competency.pk)
        if latest_assessment is not None:
            status = int(latest_assessment['status'])
            status_approved = latest_assessment['approved']
            last_assessed = latest_assessment['date']
            reviewer_id = latest_assessment['reviewer_id']
            if reviewer_id and reviewer_id not in reviewers:
                reviewers[reviewer_id] = User.objects.get(pk=reviewer_id)
            latest_assessment['reviewer'] = reviewers.get(reviewer_id)
        else:
            status = 0
            status_approved = False
            last_assessed = ''
        action_items_total = ActionItemAssessment.objects.filter(student=user, archived=False, competency_id=competency).count()
        global_action_items_total = ActionItemGlobal.objects.filter(competency_id=competency).count
        action_items_done = ActionItemAssessment.objects.filter(
            student=user, marked_done=True, archived=False, competency_id=competency).count()
        competencies_list.append({
            'title': competency.title,
            'content': competency.content,
            'id': competency.pk,
            'user_defined': competency.user_defined,
            'hidden_for': competency.hidden_for,
            'hidden_for_all_users': competency.hidden_for_all_users,
            'status': status,
            'status_approved': status_approved,
            'last_assessed': last_assessed,
            'assessment': latest_assessment,
            'action_items_total': action_items_total,
            'global_action_items_total': global_action_items_total,
            'action_items_done': action_items_done,
            'comment_count': competency.get_comments(user.id).count() if user else 0,
            'has_video': competency.has_video_content(),
            'has_attachments': Attachment.objects.filter(competency=competency),
            'attachment_count': Attachment.objects.filter(competency=competency).count(),
            'has_questions': QuestionGlobal.objects.filter(competency=competency),
            'question_count_total': QuestionGlobal.objects.filter(competency=competency).count(),
            'has_text_content': competency.has_text_content(),
        })

    return competencies_list

def get_competencies_for_stage_with_status_for_template(user, stage, user_defined=False, unread_competency_ids=[]):
    competencies = Competency.objects.filter(
        stage=stage,
        student=user if user_defined else None,
        user_defined=user_defined).order_by('order').distinct()
    competencies_list = []
    reviewers = {}
    latest_assessments = get_latest_assessments_for_competency_ids([c.pk for c in competencies], user)
    for competency in competencies:
        latest_assessment = latest_assessments.get(competency.pk)
        if latest_assessment is not None:
            status = int(latest_assessment['status'])
            status_approved = latest_assessment['approved']
            last_assessed = latest_assessment['date']
            reviewer_id = latest_assessment['reviewer_id']
            if reviewer_id and reviewer_id not in reviewers:
                reviewers[reviewer_id] = User.objects.get(pk=reviewer_id)
            latest_assessment['reviewer'] = reviewers.get(reviewer_id)
        else:
            status = 0
            status_approved = False
            last_assessed = ''
        action_items_total = ActionItemAssessment.objects.filter(student=user, archived=False, competency_id=competency).count()
        global_action_items_total = ActionItemGlobal.objects.filter(competency_id=competency).count
        action_items_done = ActionItemAssessment.objects.filter(
            student=user, marked_done=True, archived=False, competency_id=competency).count()
        competencies_list.append({
            'title': competency.title,
            'content': competency.content,
            'id': competency.pk,
            'user_defined': competency.user_defined,
            'hidden_for': competency.hidden_for,
            'hidden_for_all_users': competency.hidden_for_all_users,
            'status': status,
            'status_approved': status_approved,
            'last_assessed': last_assessed,
            'assessment': latest_assessment,
            'action_items_total': action_items_total,
            'global_action_items_total': global_action_items_total,
            'action_items_done': action_items_done,
            'comment_count': competency.get_comments(user.id).count() if user else 0,
            'has_video': competency.has_video_content(),
            'has_attachments': Attachment.objects.filter(competency=competency),
            'global_attachment_count': Attachment.objects.filter(competency=competency, user=None).count(),
            'has_questions': QuestionGlobal.objects.filter(competency=competency),
            'question_count_total': QuestionGlobal.objects.filter(competency=competency).count(),
            'has_text_content': competency.has_text_content(),
            'unread_activity': True if competency.id in unread_competency_ids else False
        })

    return competencies_list


def get_stages_with_progress(user, roadmap_id, unread_competency_ids=[]):
    stages = Stage.objects.filter(roadmap_id=roadmap_id).prefetch_related('competency_set').order_by('order')
    stages_list = []
    total_score = 0
    total_competency_count = 0
    competency_ids = [c.pk for stage in stages for c in stage.competency_set.all()]
    latest_assessments = get_latest_assessments_for_competency_ids(competency_ids, user.pk)
    total_action_items = ActionItemAssessment.objects.filter(competency_id__in=competency_ids, student=user).count()
    total_action_items_complete = ActionItemAssessment.objects.filter(competency_id__in=competency_ids, student=user, marked_done=True).count()
    total_questions = QuestionGlobal.objects.filter(competency_id__in=competency_ids).count()
    total_questions_answered = QuestionAnswer.objects.filter(competency_id__in=competency_ids, student=user, answer__isnull=False).exclude(answer__exact="").count()


    for stage in stages:
        unread_activity = False
        number_of_competencies = len(stage.competency_set.all())
        if number_of_competencies == 0:
            stage.progress = 0
        else:
            # We compute the Stage progress in percent as
            # (SUM over the number of points for each Competency) / ( # of Competencies * 3 ) * 100
            total_competency_count += number_of_competencies
            stage_score = 0
            for competency in stage.competency_set.all():
                latest_assessment = latest_assessments.get(competency.pk)
                if latest_assessment is not None:
                    stage_score += int(latest_assessment['status'])
                if competency.id in unread_competency_ids:
                    unread_activity = True
            total_score += stage_score
            stage.progress = round(float(stage_score) / (number_of_competencies * 3) * 100, 2)
        stages_list.append({
            'id': stage.id,
            'title': stage.title,
            'description': stage.description,
            'progress': stage.progress,
            'order': stage.order,
            'unread_activity': unread_activity,
            'hidden_from_users': stage.hidden_from_users
        })

    return {
        'stages': stages_list,
        'total_progress': round(float(total_score) / (total_competency_count * 3) * 100, 2) if total_competency_count else 0,
        'total_action_items': total_action_items,
        'total_action_items_complete': total_action_items_complete,
        'total_questions': total_questions,
        'total_questions_answered': total_questions_answered,
    }


def get_competency_history(user, competency_id):
    # We decided to take the assessment that was added last as the current status of a competency.
    # (As opposed to the one with the latest date of assessment)
    # If changed, be sure to change it everywhere* else
    return Assessment.objects.filter(student=user, competency__id=competency_id).exclude(status=Assessment.GREY).order_by('-id')


def get_latest_assessment_for_competency_id(competency_id, student_id):
    return Assessment.objects.filter(competency_id=competency_id, student_id=student_id).order_by('-id').first()


def get_latest_assessments_for_competency_ids(competency_ids, student):
    latest = {}
    assessments = Assessment.objects.filter(competency_id__in=competency_ids, student=student).values('id', 'competency_id', 'date', 'status', 'approved', 'rejected', 'reviewer_id')
    for assessment in assessments:
        if not latest.get(assessment['competency_id']) or assessment['id'] > latest[assessment['competency_id']]['id']:
            latest[assessment['competency_id']] = {
                'id': assessment['id'],
                'date': assessment['date'],
                'status': assessment['status'],
                'approved': assessment['approved'],
                'rejected': assessment['rejected'],
                'reviewer_id': assessment['reviewer_id'],
            }
    return latest


def get_latest_assessments_for_competency_ids_and_student_ids(competency_ids, student_ids):
    latest = {}
    assessments = Assessment.objects.filter(competency_id__in=competency_ids, student_id__in=student_ids).values('id', 'competency_id', 'date', 'status', 'approved', 'rejected', 'student_id', 'reviewer_id')
    for assessment in assessments:
        key = (assessment['student_id'], assessment['competency_id'])
        if not latest.get(key) or assessment['id'] > latest[key]['id']:
            latest[key] = {
                'id': assessment['id'],
                'date': assessment['date'],
                'status': assessment['status'],
                'approved': assessment['approved'],
                'rejected': assessment['rejected'],
                'student_id': assessment['student_id'],
                'reviewer_id': assessment['reviewer_id'],
            }
    return latest


def create_action_items(global_items, items, user):
    for item in items:
        if item.parent is not None and item.parent_id in global_items:
            # action item already exists, we don't have to add it
            del global_items[item.parent_id]
    to_create = [
        ActionItemAssessment(
            parent_id=item_id,
            student=user,
            competency_id=competency_id
        ) for item_id, competency_id in global_items.items()
    ]
    try:
        ActionItemAssessment.objects.bulk_create(to_create)
    except IntegrityError:
        # not sure how we sometimes are trying to create duplicates
        pass


def copy_global_action_items(user, roadmap):
    global_items = {item.id: item.competency_id for item in ActionItemGlobal.objects.filter(competency__stage__roadmap=roadmap)}
    assessments = ActionItemAssessment.objects.select_related('parent').filter(student=user, competency__stage__roadmap=roadmap)
    create_action_items(global_items, assessments, user)


def get_action_items(user, competency_id, archived=False):
    global_items = {item.id: item.competency_id for item in ActionItemGlobal.objects.filter(competency_id=competency_id)}
    assessments = ActionItemAssessment.objects.select_related('parent').filter(student=user, competency_id=competency_id)
    create_action_items(global_items, assessments, user)
    items = (ActionItemAssessment.objects.select_related('parent').filter(student=user, archived=archived, competency_id=competency_id) \
        | ActionItemAssessment.objects.select_related('parent').filter(student=user, archived=archived, parent__competency_id=competency_id))
    return items.annotate(is_global=Count('parent')).order_by('-is_global', 'order')

def get_all_action_items(user, archived=False):
    action_items = ActionItemAssessment.objects.filter(student=user).order_by('due_date')
    return action_items

def get_global_action_items(request, competency=0):
    # cohorts = request.user.cohort.all()
    # if cohorts:
    #     global_items = ActionItemGlobal.objects.filter((Q(cohort=None) | Q(cohort__in=cohorts)) & Q(competency__id=competency).order_by('order')).distinct()
    # else:
    global_items = ActionItemGlobal.objects.filter(competency__id=competency).order_by('order')
    return list(global_items.order_by('order'))

def create_questions(global_items, items, user):
    for item in items:
        if item.parent is not None and item.parent_id in global_items:
            # action item already exists, we don't have to add it
            del global_items[item.parent_id]
    to_create = [
        QuestionAnswer(
            parent_id=item_id,
            student=user,
            competency_id=competency_id
        ) for item_id, competency_id in global_items.items()
    ]
    try:
        QuestionAnswer.objects.bulk_create(to_create)
    except IntegrityError:
        # not sure how we sometimes are trying to create duplicates
        pass

def copy_global_questions(user, roadmap):
    global_items = {item.id: item.competency_id for item in QuestionGlobal.objects.filter(competency__stage__roadmap=roadmap)}
    assessments = QuestionAnswer.objects.select_related('parent').filter(student=user, competency__stage__roadmap=roadmap)
    create_questions(global_items, assessments, user)

def get_questions(user, competency_id):
    global_items = {item.id: item.competency_id for item in QuestionGlobal.objects.filter(competency_id=competency_id)}
    assessments = QuestionAnswer.objects.select_related('parent').filter(student=user, competency_id=competency_id)
    create_questions(global_items, assessments, user)
    items = (QuestionAnswer.objects.select_related('parent').filter(student=user, competency_id=competency_id) \
        | QuestionAnswer.objects.select_related('parent').filter(student=user, parent__competency_id=competency_id))
    return items.annotate(is_global=Count('parent')).order_by('-is_global', 'order')

def get_all_questions(user):
    questions = QuestionAnswer.objects.filter(student=user)
    return questions

def get_global_questions(request, competency=0):
    global_items = QuestionGlobal.objects.filter(competency__id=competency).order_by('order')
    return list(global_items.order_by('order'))

def create_content(global_items, items, user):
    for item in items:
        if item.parent is not None and item.parent_id in global_items:
            # action item already exists, we don't have to add it
            del global_items[item.parent_id]
    to_create = [
        ContentResponse(
            parent_id=item_id,
            student=user,
            competency_id=competency_id
        ) for item_id, competency_id in global_items.items()
    ]
    try:
        ContentResponse.objects.bulk_create(to_create)
    except IntegrityError:
        # not sure how we sometimes are trying to create duplicates
        pass

def copy_global_content(user, roadmap):
    global_items = {item.id: item.competency_id for item in ContentGlobal.objects.filter(competency__stage__roadmap=roadmap)}
    assessments = ContentResponse.objects.select_related('parent').filter(student=user, competency__stage__roadmap=roadmap)
    create_content(global_items, assessments, user)

def get_content(user, competency_id):
    global_items = {item.id: item.competency_id for item in ContentGlobal.objects.filter(competency_id=competency_id)}
    assessments = ContentResponse.objects.select_related('parent').filter(student=user, competency_id=competency_id)
    create_content(global_items, assessments, user)
    items = (ContentResponse.objects.select_related('parent').filter(student=user, competency_id=competency_id) \
        | ContentResponse.objects.select_related('parent').filter(student=user, parent__competency_id=competency_id))
    return items.annotate(is_global=Count('parent')).order_by('-is_global', 'order')

def get_all_content(user):
    content = ContentResponse.objects.filter(student=user)
    return content

def get_global_content(request, competency=0):
    global_items = ContentGlobal.objects.filter(competency__id=competency).order_by('order')
    return list(global_items.order_by('order'))

def roadmaps(request):
    roadmaps = request.user.roadmaps.filter(company=request.user.company).extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
    user_cohorts = request.user.cohort.all()
    company_cohorts = Cohort.objects.filter(company_id=request.user.company_id)
    company_roadmaps = Roadmap.objects.filter(company_id=request.user.company_id)
    student_action_items = ActionItemAssessment.objects.filter(student=request.user, archived=False)
    student_action_items_due_today = ActionItemAssessment.objects.all().filter(due_date=datetime.date.today())

    for cohort in user_cohorts:
        user_cohort_roadmaps = cohort.roadmaps.all()
    if not user_cohorts:
        user_cohort_roadmaps = roadmaps
    for roadmap in roadmaps:
        roadmap.stats = get_stages_with_progress(request.user, roadmap.id)

    company_unassigned_roadmaps = Roadmap.objects.filter(company_id=request.user.company_id, cohorts=None)
    roadmap_templates = Roadmap.objects.filter(company_id=request.user.company_id).exclude(id__in=[r.id for r in roadmaps]).order_by('title')
    combine = company_unassigned_roadmaps | user_cohort_roadmaps
    total = combine.distinct().exclude(id__in=[r.id for r in roadmaps])

    assigned_roadmaps = request.user.get_current_assigned_roadmaps()

    context = {
        'roadmaps': roadmaps,
        'assigned_roadmaps': assigned_roadmaps,
        'student_action_items': student_action_items,
        'student_action_items_due_today': student_action_items_due_today,
        'user_cohort_roadmaps': user_cohort_roadmaps,
        'user_cohorts': user_cohorts,
        'company_cohorts': company_cohorts,
        'company_roadmaps': company_roadmaps,
        'roadmap_templates': roadmap_templates,
        'company_unassigned_roadmaps': company_unassigned_roadmaps,
        'total': total,
    }
    if request.user.is_approved:
        return render(request, 'dashboard/roadmaps.html', context)
    else:
        return render(request, 'dashboard/non-approved.html', context)

def roadmap_list(request):
    roadmaps = Roadmap.objects.all().filter(company=1).order_by('title').values()

    stage_data = []
    for roadmap in roadmaps:
        stage_data.append(Stage.objects.filter(roadmap=roadmap['id']).order_by('order').values())

    competency_data = []
    for stage_list in stage_data:
        for stage in stage_list:
            competency_data.append(Competency.objects.filter(stage=stage['id']).order_by('order').values('title', 'description', 'stage'))

    context = {
        'roadmaps': roadmaps,
        'stage_data': stage_data,
        'competency_data': competency_data,
    }

    return render(request, 'dashboard/roadmap-list.html', context)


def choose_active_company(request):
    context = {}
    context['active_company'] = request.user.company
    context['companies'] = request.user.companies
    return render(request, 'dashboard/active-company.html', context)


def my_action_items(request):
    student_action_items_to_do = ActionItemAssessment.objects.filter(student=request.user, archived=False, marked_done=False).exclude(due_date=datetime.date.today())
    student_action_items_due_today = ActionItemAssessment.objects.all().filter(student=request.user, due_date=datetime.date.today())

    student_action_items_to_do = [obj for obj in student_action_items_to_do if obj.company == request.user.company]
    student_action_items_due_today = [obj for obj in student_action_items_due_today if obj.company == request.user.company]

    context = {
        'student_action_items_to_do': student_action_items_to_do,
        'student_action_items_due_today': student_action_items_due_today,
    }

    return render(request, 'dashboard/all-action-items.html', context)


def super_dashboard(request):
    companies = Company.objects.all()

    context = {
        'companies': companies,
    }

    return render(request, 'dashboard/super_dashboard.html', context)


def dashboard(request):
    SORT_BY_OPTIONS = collections.OrderedDict()
    SORT_BY_OPTIONS['first_name'] = 'First Name'
    SORT_BY_OPTIONS['last_name'] = 'Last Name'
    SORT_BY_OPTIONS['total_progress'] = 'Progress'
    SORT_BY_OPTIONS['red_assessment_count'] = 'Reds'
    SORT_BY_OPTIONS['last_seen'] = 'Last Login'
    sort_by = request.GET.get('sort_by') or 'first_name'
    # Add all users that have a company assignment that matches the company of the user request
    company_users = User.objects.filter(company=request.user.company)
    company_users = company_users.distinct()

    if request.user.is_cohort_admin():
        students = company_users.filter(cohort__id__in=request.user.cohort.all())
        students_roadmaps_ids = set()
        for student in students:
            for roadmap in student.roadmaps.all():
                students_roadmaps_ids.add(roadmap.id)
        dash_roadmaps = Roadmap.objects.filter(id__in=students_roadmaps_ids, is_published=True).extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
    elif request.user.is_admin():
        dash_roadmaps = Roadmap.objects.filter(company=request.user.company, is_published=True).extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
        students = company_users
    elif request.user.is_coach():
        if request.user.company.users_can_assign_specific_coaches_for_specific_roadmaps:
            # only show students that have this coach as their assigned coach
            assignments = AssignedRoadmap.objects.filter(coach=request.user)
            student_ids = []
            students_roadmaps_ids = set()
            for assignment in assignments:
                if assignment.roadmap.company == request.user.company:
                    student_ids.append(assignment.student.id)
                    students_roadmaps_ids.add(assignment.roadmap.id)
            students = User.objects.filter(id__in=student_ids)
        else:
            students = company_users.filter(coach=request.user.pk)
            students_roadmaps_ids = set()
            for student in students:
                for roadmap in student.roadmaps.all():
                    students_roadmaps_ids.add(roadmap.id)

        dash_roadmaps = Roadmap.objects.filter(id__in=students_roadmaps_ids, is_published=True).extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
    else:
        return redirect('roadmaps')

    summary = {
        'total': 0,
        'green': 0,
        'green_pending': 0,
        'green_approved': 0,
        'green_rejected': 0,
        'yellow': 0,
        'red': 0,
        'grey': 0,
    }
    for roadmap in dash_roadmaps:
        roadmap = get_roadmap_stats(roadmap, students)
        summary['total'] += roadmap.total
        summary['green'] += roadmap.greens
        summary['green_pending'] += roadmap.greens - roadmap.greens_approved - roadmap.greens_rejected
        summary['green_approved'] += roadmap.greens_approved
        summary['green_rejected'] += roadmap.greens_rejected
        summary['yellow'] += roadmap.yellows
        summary['red'] += roadmap.reds
        summary['grey'] += roadmap.greys

    all_latest_assessments = {}
    for (student_id, competency_id), assessment_dict in get_latest_assessments_for_competency_ids_and_student_ids(Competency.objects.filter(stage__roadmap__in=dash_roadmaps).values_list('id', flat=True), [student.pk for student in students]).items():
        all_latest_assessments.setdefault(student_id, {})
        all_latest_assessments[student_id][competency_id] = assessment_dict
    for student in students:
        if request.user.company.users_can_assign_specific_coaches_for_specific_roadmaps and request.user.is_coach() and not request.user.is_admin():
            roadmaps = []
            for assignment in student.get_current_assigned_roadmaps():
                if assignment.coach == request.user:
                    if assignment.roadmap.pinned == False:
                        roadmaps.append(assignment.roadmap)
            pinned_roadmaps = []
            for assignment in student.get_current_assigned_roadmaps():
                if assignment.coach == request.user:
                    if assignment.roadmap.pinned == True:
                        pinned_roadmaps.append(assignment.roadmap)
            archived_roadmaps = []
        else:
            roadmaps = student.roadmaps.filter(company=request.user.company.id).exclude(pinned="True").extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
            pinned_roadmaps = student.roadmaps.all().filter(pinned="True").extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
            archived_roadmaps = student.archived_roadmaps.all()
        student.pinned_roadmaps_list = pinned_roadmaps
        student.roadmaps_list = roadmaps
        student.archived_roadmaps_list = archived_roadmaps
        student_competencies = Competency.objects.filter(stage__roadmap__in=roadmaps).values('id', 'stage__roadmap_id')
        competency_roadmaps = {competency['id']: competency['stage__roadmap_id'] for competency in student_competencies}
        competency_ids = competency_roadmaps.keys()
        for competency_id in Notification.objects.filter(sender_object_id=student.id, recipient_id=request.user.pk, read=False, target_object_id__in=competency_ids).values_list('target_object_id', flat=True):
            for roadmap in roadmaps:
                if roadmap.id == competency_roadmaps[competency_id]:
                    roadmap.unread = True
        # latest_assessments = get_latest_assessments_for_competency_ids(competency_ids, student.pk)
        latest_assessments = all_latest_assessments.get(student.pk, {})
        student.red_assessment_count = 0
        student.total_progress = 0

        for roadmap in roadmaps:
            date_assigned_objects = student.roadmapassignment_set.all().filter(roadmap=roadmap)
            roadmap.date_list = date_assigned_objects
            first_assessment = Assessment.objects.filter(competency__stage__roadmap=roadmap, student=student).order_by('id').first()
            roadmap.started = first_assessment.date if first_assessment else None
            roadmap_competency_ids = set()
            total_competency_count = 0
            for competency_id, roadmap_id in competency_roadmaps.items():
                if roadmap_id == roadmap.id:
                    roadmap_competency_ids.add(competency_id)
                    total_competency_count += 1
            roadmap.red_assessment_count = 0
            roadmap.pending_items_count = 0
            total_score = 0
            for competency_id, details in latest_assessments.items():
                if competency_id in roadmap_competency_ids:
                    if details['status'] == Assessment.RED:
                        roadmap.red_assessment_count += 1
                        student.red_assessment_count += 1
                    if details['status'] == Assessment.GREEN and not details['approved'] and not details['rejected']:
                        roadmap.pending_items_count += 1
                    total_score += int(details['status'])
            roadmap.total_progress = round(float(total_score) / (total_competency_count * 3) * 100, 2) if total_competency_count else 0
            roadmap.pending_items_count += ActionItemAssessment.objects.filter(competency__id__in=roadmap_competency_ids, student=student, marked_done=True, approved_done=False).count()
            student.total_progress += roadmap.total_progress
        student.total_progress = student.total_progress / len(roadmaps) if len(roadmaps) else 0
        student.activity = get_login_status(student.last_seen)

        for roadmap in pinned_roadmaps:
            date_assigned_objects = student.roadmapassignment_set.all().filter(roadmap=roadmap)
            roadmap.date_list = date_assigned_objects
            first_assessment = Assessment.objects.filter(competency__stage__roadmap=roadmap, student=student).order_by('id').first()
            roadmap.started = first_assessment.date if first_assessment else None
            roadmap_competency_ids = set()
            total_competency_count = 0
            for competency_id, roadmap_id in competency_roadmaps.items():
                if roadmap_id == roadmap.id:
                    roadmap_competency_ids.add(competency_id)
                    total_competency_count += 1
            roadmap.red_assessment_count = 0
            roadmap.pending_items_count = 0
            total_score = 0
            for competency_id, details in latest_assessments.items():
                if competency_id in roadmap_competency_ids:
                    if details['status'] == Assessment.RED:
                        roadmap.red_assessment_count += 1
                        student.red_assessment_count += 1
                    if details['status'] == Assessment.GREEN and not details['approved'] and not details['rejected']:
                        roadmap.pending_items_count += 1
                    total_score += int(details['status'])
            roadmap.total_progress = round(float(total_score) / (total_competency_count * 3) * 100, 2) if total_competency_count else 0
            roadmap.pending_items_count += ActionItemAssessment.objects.filter(competency__id__in=roadmap_competency_ids, student=student, marked_done=True, approved_done=False).count()
            student.total_progress += roadmap.total_progress
        student.total_progress = student.total_progress / len(roadmaps) if len(roadmaps) else 0
        student.activity = get_login_status(student.last_seen)

    if sort_by:
        reversed = False
        if sort_by in ['red_assessment_count', 'total_progress']:
            reversed = True
            students = sorted(students, key=operator.attrgetter(sort_by), reverse=reversed)
        elif sort_by == 'last_seen':
            reversed = True
            students = sorted(students, key=lambda x: x.last_seen or timezone.make_aware(datetime.datetime(1900,1,1)), reverse=reversed)
        else:
            students = sorted(students, key=operator.attrgetter(sort_by), reverse=reversed)

    notifications = Notification.objects.all_for_user(request.user).filter(sender_company=request.user.company).order_by('-timestamp').prefetch_related('target_object', 'sender_object', 'recipient').filter(read=False)
    notifications_count = Notification.objects.all_for_user(request.user).filter(sender_company=request.user.company).order_by('-timestamp').prefetch_related('target_object', 'sender_object', 'recipient').filter(read=False).count()


    context = {
        'roadmaps': dash_roadmaps,
        'students': students,
        'students_count': len(students),
        'summary': summary,
        'sort_by_options': SORT_BY_OPTIONS,
        'current_sort_name': SORT_BY_OPTIONS.get(sort_by) if sort_by else None,
        'notifications': notifications,
        'notifications_count': notifications_count,
    }
    return render(request, 'dashboard/dashboard.html', context)

def get_roadmap_stats(roadmap, users_set):
    competency_ids = Competency.objects.filter(stage__roadmap=roadmap).values_list('id', flat=True)
    if not users_set:
        raise Http404
    roadmap_user_ids = users_set.filter(roadmaps__id__in=[roadmap.id]).values_list('id', flat=True)
    roadmap.users_count = len(roadmap_user_ids)
    roadmap.coaches = User.objects.filter(students__id__in=roadmap_user_ids).distinct()
    roadmap.total = roadmap.users_count * len(competency_ids)
    roadmap.reds = 0
    roadmap.greens = 0
    roadmap.greens_approved = 0
    roadmap.greens_rejected = 0
    roadmap.yellows = 0

    assessment_student_set = set()
    assessments = get_latest_assessments_for_competency_ids_and_student_ids(competency_ids, roadmap_user_ids)
    for assessment in assessments.values():
        assessment_student_set.add(assessment['student_id'])
        if assessment['status'] == Assessment.RED:
            roadmap.reds += 1
        elif assessment['status'] == Assessment.GREEN:
            roadmap.greens += 1
            if assessment['approved']:
                roadmap.greens_approved += 1
            if assessment['rejected']:
                roadmap.greens_rejected += 1
        elif assessment['status'] == Assessment.YELLOW:
            roadmap.yellows += 1
    roadmap.greys = roadmap.total - roadmap.reds - roadmap.greens - roadmap.yellows
    roadmap.not_started = len(set(roadmap_user_ids) - assessment_student_set)

    roadmap.chartdata = {
        'green': roadmap.greens,
        'yellow': roadmap.yellows,
        'red': roadmap.reds,
        'grey': roadmap.greys
    }

    return roadmap

def get_login_status(datetime):
    status = {}
    if datetime:
        current = timezone.now()
        if current.day == datetime.day:
            status['time'] = 'Today'
            status['class'] = 'normal'
        elif current.day == datetime.day + 1:
            status['time'] = 'Yesterday'
            status['class'] = 'normal'
        else:
            diff = current - datetime
            periods = (
                (diff.days / 365, 'year', 'years'),
                (diff.days / 30, 'month', 'months'),
                (diff.days / 7, 'week', 'weeks'),
                (diff.days, 'day', 'days'),
            )
            for period, singular, plural in periods:
                if period >= 1:
                    status['time'] = '%d %s' % (period, plural if period >= 2 else singular)
                    status['class'] = 'normal'
                    return status
    else:
        status['time'] = 'Never'
        status['class'] = 'danger'
    return status


def roadmap(request, roadmap_id, **kwargs):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    context = {}
    if 'student_id' in kwargs:
        student = get_object_or_404(User, pk=kwargs['student_id'])
        unread_competency_ids = Notification.objects.filter(sender_object_id=student.id, recipient_id=request.user.pk, verb=Notification.NEEDS_APPROVAL, read=False).values_list('target_object_id', flat=True)
        if not request.user.can_access_user(student):
            raise Http404
    else:
        student = request.user
        unread_competency_ids = Notification.objects.filter(recipient_id=request.user.pk, verb__in=[Notification.NEEDS_WORK, Notification.APPROVED], read=False).values_list('target_object_id', flat=True)
    context['observing'] = request.user != student
    context['student'] = student
    context['stages_info'] = get_stages_with_progress(student, roadmap_id, unread_competency_ids=unread_competency_ids)
    context['roadmap'] = roadmap
    context['stages_count'] = Stage.objects.filter(roadmap=roadmap).count()
    copy_global_action_items(student, roadmap)
    return render(request, 'dashboard/roadmap.html', context)


def coach_view_2(request, pk=None):
    if pk:
        users = User.objects.all()
        if not request.user.is_superuser:
            if request.user.cohort.exists():
                users = users.filter(cohort__in=request.user.cohort.all())
            else:
                users = users.filter(company=request.user.company)
        user = get_object_or_404(users, pk=pk)
    else:
        user = None
    if request.method == 'POST':
        form = CoachForm2(request.POST, instance=user, request=request)
        if form.is_valid():
            form.save()
            if user:
                messages.success(request, 'Updated successfully.')
            return redirect('profile')
    else:
            form = CoachForm2(instance=user, request=request)

    context = {
        'form': form,
        'user': user,
    }
    return render(request, 'dashboard/add-coach.html', context=context)




class ProfileView(UpdateView):
    model = User
    form_class = ProfileForm

    def get_object(self):
        return self.request.user

    def form_valid(self, form):
        previous_coaches = set(self.request.user.coach.all())
        r = super().form_valid(form)
        # if user changed password, this will prevent them from being logged out
        # update_session_auth_hash(self.request, self.get_object())
        messages.success(self.request, 'Profile saved successfully!')
        new_coaches = set(self.request.user.coach.all()).difference(previous_coaches)
        send_new_assigned_user_email(self.request, self.request.user, new_coaches)
        return r

    success_url = reverse_lazy('profile')


class ChangePasswordView(FormView):
    form_class = ChangePasswordForm
    template_name = 'dashboard/change-password.html'
    success_url = reverse_lazy('profile')

    def get_form_kwargs(self):
        kwargs = super(ChangePasswordView, self).get_form_kwargs()
        kwargs.update({'user': self.request.user})
        return kwargs

    def form_valid(self, form):
        form.user.set_password(form.cleaned_data['new_password'])
        form.user.save()
        update_session_auth_hash(self.request, form.user)
        messages.success(self.request, 'Password changed successfully.')
        return super(ChangePasswordView, self).form_valid(form)

class CompetencyAddView(View):
    def get(self, request):
        student_id = request.GET.get('student_id')
        if student_id:
            student = get_object_or_404(User, pk=student_id)
            if not student.coach.filter(id=self.request.user.id).exists():
                # logged in user is not actually user's coach
                raise Http404
        else:
            student = None
        stage = get_object_or_404(Stage, pk=request.GET.get('stage_id'))
        if stage:
            last_compentency = Competency.objects.filter(stage=stage).order_by('order').last()
            if last_compentency and last_compentency.order:
                next_order = last_compentency.order + 1
            else:
                next_order = 1
        else:
            next_order = 0
        competency = Competency.objects.create(
            student=student,
            stage=stage,
            title='Untitled Objective',
            description='',
            red_description=request.user.company.default_red_assessment,
            yellow_description=request.user.company.default_yellow_assessment,
            green_description=request.user.company.default_green_assessment,
            order=next_order,
            user_defined=True if student else False,
        )
        if student_id:
            # url = reverse('competency_admin_edit', args=[student_id, competency.id])
            pass
        else:
            url = reverse('staff_competency_edit', args=[competency.id])
        return redirect('{}?n=1'.format(url))

def is_mobile(request):
    MOBILE_AGENT_RE=re.compile(r".*(iphone|mobile|androidtouch)",re.IGNORECASE)
    if MOBILE_AGENT_RE.match(request.META['HTTP_USER_AGENT']):
        return True
    else:
        return False

class CompetencyDetailView(View):
    def _get_dashboard_url(self, student, stage_id, edit=False):
        roadmap_id = get_object_or_404(Stage, pk=stage_id).roadmap_id
        if student:
            if student.id != self.request.user.id:
                url = reverse('user_roadmap_observe', args=[student.id, roadmap_id])
            else:
                url = reverse('roadmap', args=[roadmap_id])
        else:
            if edit:
                url = reverse('staff_roadmap_edit', args=[roadmap_id])
            else:
                url = reverse('staff_roadmap', args=[roadmap_id])
        return '{}#stage{}'.format(url, stage_id)

    def get(self, request, pk, student_id=None, edit=False, form=None, staff=False):
        context = {}
        user_groups = self.request.user.group_names

        if student_id:
            student = get_object_or_404(User, pk=student_id)
            if not self.request.user.can_access_user(student):
                raise Http404
        elif staff:
            student = None
        else:
            student = self.request.user
        competency = get_object_or_404(Competency, pk=pk)
        hidden_for_list = competency.hidden_for.all()
        if student in hidden_for_list:
            hidden_for_student = True
        else:
            hidden_for_student = False
        student_specific_competencies = Competency.objects.filter(stage__roadmap=competency.stage.roadmap, student=student).order_by('student', 'stage__order', 'order')
        student_hidden_competencies = Competency.objects.filter(stage__roadmap=competency.stage.roadmap, hidden_for__isnull=False).order_by('student', 'stage__order', 'order')
        all_other_competencies = Competency.objects.filter(stage__roadmap=competency.stage.roadmap, student__isnull=True).order_by('student', 'stage__order', 'order').exclude(hidden_for=student)
        competencies_1 = student_specific_competencies | student_hidden_competencies | all_other_competencies
        competencies_2 = competencies_1.distinct()
        competencies = list(competencies_2)

        if self.request.user.is_coach() or self.request.user.is_admin():
            student_specific_competencies = Competency.objects.filter(stage__roadmap=competency.stage.roadmap, student=student).order_by('student', 'stage__order', 'order')
            student_hidden_competencies = Competency.objects.filter(stage__roadmap=competency.stage.roadmap, hidden_for__isnull=False).order_by('student', 'stage__order', 'order')
            all_other_competencies = Competency.objects.filter(stage__roadmap=competency.stage.roadmap, student__isnull=True).order_by('student', 'stage__order', 'order')
            competencies_1 = student_specific_competencies | student_hidden_competencies | all_other_competencies
            competencies_2 = competencies_1.distinct()
            competencies = list(competencies_2)
            competency_index = competencies.index(competency)
            if competency_index == 0:
                previous_competency = None
            else:
                previous_competency = competencies[competency_index - 1]
                context['previous_competency_name'] = previous_competency.title
            if competency_index == len(competencies) - 1:
                next_competency = None
            else:
                next_competency = competencies[competency_index + 1]
                context['next_competency_name'] = next_competency.title
        else:
            student_specific_competencies = Competency.objects.filter(stage__roadmap=competency.stage.roadmap, student=student).order_by('student', 'stage__order', 'order').exclude(hidden_for=student)
            student_hidden_competencies = Competency.objects.filter(stage__roadmap=competency.stage.roadmap, hidden_for__isnull=False).order_by('student', 'stage__order', 'order').exclude(hidden_for=student)
            all_other_competencies = Competency.objects.filter(stage__roadmap=competency.stage.roadmap, student__isnull=True).order_by('student', 'stage__order', 'order').exclude(hidden_for=student)
            competencies_1 = student_specific_competencies | student_hidden_competencies | all_other_competencies
            competencies_2 = competencies_1.distinct()
            competencies = list(competencies_2)
            competency_index = competencies.index(competency)
            if competency_index == 0:
                previous_competency = None
            else:
                previous_competency = competencies[competency_index - 1]
                context['previous_competency_name'] = previous_competency.title
            if competency_index == len(competencies) - 1:
                next_competency = None
            else:
                next_competency = competencies[competency_index + 1]
                context['next_competency_name'] = next_competency.title

        related_unread_notifications = []
        if student_id:
            comments_ids = Comment.objects.filter(competency=competency, student_id=student_id).values_list('id', flat=True)
            comment_notifications = Notification.objects.filter(target_object_id__in=comments_ids, recipient=self.request.user, sender_object_id=student_id, read=False)
            unread_notifications = Notification.objects.filter(read=False, recipient=self.request.user, verb=Notification.NEEDS_APPROVAL, target_object_id=competency.id, sender_object_id=student_id)
            if previous_competency:
                context['previous_competency_url'] = reverse('user_competency_observe', args=[student_id, previous_competency.pk])
            if next_competency:
                context['next_competency_url'] = reverse('user_competency_observe', args=[student_id, next_competency.pk])
        else:
            comments_ids = Comment.objects.filter(competency=competency, student_id=self.request.user).values_list('id', flat=True)
            comment_notifications = Notification.objects.filter(target_object_id__in=comments_ids, recipient=self.request.user, read=False)
            unread_notifications = Notification.objects.filter(read=False, recipient=self.request.user, verb__in=[Notification.APPROVED, Notification.NEEDS_WORK], target_object_id=competency.id)
            if staff:
                if not edit:
                    if previous_competency:
                        context['previous_competency_url'] = reverse('staff_competency', args=[previous_competency.pk])
                    if next_competency:
                        context['next_competency_url'] = reverse('staff_competency', args=[next_competency.pk])
            else:
                if previous_competency:
                    context['previous_competency_url'] = reverse('competency', args=[previous_competency.pk])
                if next_competency:
                    context['next_competency_url'] = reverse('competency', args=[next_competency.pk])

        related_unread_notifications = comment_notifications | unread_notifications
        for notification in related_unread_notifications:
            notification.read = True
            notification.save()
        context['history'] = get_competency_history(student, pk)
        context['assessment'] = Assessment.objects.filter(student=student, competency__id=pk).order_by('-id').first()
        context['note'] = Note.objects.filter(competency=competency, student=student).last()
        context['competency'] = competency
        context['hidden_for_list'] = hidden_for_list
        context['hidden_for_student'] = hidden_for_student
        context['student'] = student
        context['observing'] = student and request.user != student
        context['attachment_form'] = AddAttachmentForm()
        context['global_attachments'] = Attachment.objects.filter(user=None, competency=competency)
        context['student_attachments'] = Attachment.objects.filter(user=student, competency=competency)
        context['global_content'] = ContentGlobal.objects.filter(competency=competency)
        context['global_questions'] = QuestionGlobal.objects.filter(competency=competency)
        context['global_action_items_total'] = ActionItemGlobal.objects.filter(competency=competency).count()
        context['action_items_done'] = ActionItemAssessment.objects.filter(
                    student=student, marked_done=True, archived=False, competency_id=competency).count()
        context['action_items_total'] = ActionItemAssessment.objects.filter(student=student, archived=False, competency_id=competency).count()



        if edit:
            context['edit'] = True
            if not form:
                context['form'] = AddEditCompetencyForm(instance=competency)
        context['can_edit'] = self.request.user.is_admin() and not student
        if student_id:
            pass
            # context['edit_url'] = reverse('competency_edit', args=[student_id, pk])
        else:
            context['edit_url'] = reverse('staff_competency_edit', args=[pk])
        context['dashboard_url'] = self._get_dashboard_url(student, competency.stage_id, edit=edit)
        context['is_mobile'] = is_mobile(request)

        return render(request, 'dashboard/competency-detail.html', context)

    def post(self, request, pk, student_id=None, edit=False, staff=False):
        # if student_id is set, then Coach has requested this
        # if not, then the student must've requested it...
        if student_id:
            student = get_object_or_404(User.objects, pk=student_id)
            if not self.request.user.can_access_user(student):
                raise Http404
            approved = True
        elif staff:
            # student = get_object_or_404(User.objects, pk=self.request.user.id)
            student = None
            approved = False
        else:
            student = self.request.user
            approved = False
        competency = get_object_or_404(Competency.objects, pk=pk)
        if 'item_id' in request.POST:
            item = get_object_or_404(ActionItemAssessment.objects, pk=request.POST.get('item_id'))
        else:
            item = None
        if 'status' in request.POST:
            assessment = Assessment.objects.create(
                student=student,
                user=self.request.user,
                competency=competency,
                status=request.POST['status'],
                date=datetime.date.today(),
                comment='',
                approved=approved,
            )
            if assessment.status == Assessment.GREEN and request.user.company.coaches_approve_green_assessments:
                notify_about_student_activity(
                    request.user, student, competency.roadmap, verb=Notification.NEEDS_APPROVAL, target=competency)
                messages.success(self.request, 'Competency/Objective now awaits approval.')
        elif 'cancel' in request.POST:
            if 'n' in request.GET:
                # new objective, delete if user clicked cancel
                competency.delete()
            if 'n' in request.GET or 'i' in request.GET:
                # n=new objective and i=return user to list view
                url = self._get_dashboard_url(student_id, competency.stage_id, edit=edit)
                return redirect(url)
        elif 'attachment' in request.FILES:
            form = AddAttachmentForm(request.POST, request.FILES)
            if form.is_valid():
                attachment = form.save(commit=False)
                attachment.user = student
                if item:
                    attachment.actionItem = item
                attachment.attacher = self.request.user
                attachment.date_attached = timezone.now()
                attachment.competency = competency
                attachment.init_file_name_and_type(request.FILES['attachment'].name)
                attachment.save()
        elif 'delete_attachment' in request.POST:
            attachment_id = request.POST.get('attachment_id')
            attachment = get_object_or_404(Attachment, pk=attachment_id)
            if attachment:
                attachment.delete()
        else:
            form = AddEditCompetencyForm(request.POST, instance=competency)
            if form.is_valid():
                if form.cleaned_data['content']:
                    form.cleaned_data['content'] = form.cleaned_data['content'].replace('max-width:320px', 'max-width:100%')
                competency = form.save()
                messages.success(self.request, 'Competency/Objective saved successfully!')
                if 'n' in request.GET:
                    # TODO: Uncomment when user will be able to enable/disable particular notifications
                    # Currently is commented out per Kollyn's request
                    # send_new_competency_in_roadmap_email(request, competency)

                    # new objective, redirect to dashboard
                    # use something like this is we want to notify coaches and mentors of new user defined objectives
                    try:
                        for student in User.objects.filter(roadmaps__id=competency.roadmap.id).all():
                            notify.send(request.user, recipient=student, verb=Notification.NEW_COMPETENCY,
                                        target=competency)
                    except:
                        pass
                return redirect(self._get_dashboard_url(student_id, competency.stage_id, edit=edit))
            else:
                return self.get(request, pk, student_id=student_id, form=form)

        if student_id:
            return redirect(reverse('user_competency_observe', args=[student_id, pk]))
        elif staff:
            return redirect(reverse('staff_competency', args=[pk]))
        else:
            return redirect(reverse('competency', args=[pk]))

# not using this function anymore. it was duplicating comments so I wrote a new one called ajax_add_comment

class CompetencyScreenRecord(View):
    def get(self, request, competency_id=None, student_id=None, item_id=None, edit=False, form=None, staff=False):
        context = {}
        if item_id:
            item = get_object_or_404(ActionItemAssessment, pk=item_id)
            context['item'] = item
            competency = get_object_or_404(Competency, pk=item.competency.id)
            student = get_object_or_404(User, pk=item.student.id)
        else:
            competency = get_object_or_404(Competency, pk=competency_id)
            student = get_object_or_404(User, pk=student_id)
        context['competency'] = competency
        context['student'] = student

        return render(request, 'dashboard/competency-screen-record.html', context)

    def post(self, request, competency_id=None, item_id=None, student_id=None, edit=False, staff=False):
        # if student_id is set, then Coach has requested this
        # if not, then the student must've requested it...
        if student_id:
            student = get_object_or_404(User.objects, pk=student_id)
            if not self.request.user.can_access_user(student):
                raise Http404
            approved = True
        elif staff:
            # student = get_object_or_404(User.objects, pk=self.request.user.id)
            student = None
            approved = False
        else:
            student = self.request.user
            approved = False
        if request.POST.get('item_id'):
            item = get_object_or_404(ActionItemAssessment.objects, pk=request.POST.get('item_id'))
            competency = get_object_or_404(Competency.objects, pk=item.competency.id)
            competency_id = item.competency.id
        else:
            competency = get_object_or_404(Competency.objects, pk=competency_id)
        if 'attachment' in request.FILES:
            form = AddAttachmentForm(request.POST, request.FILES)
            if form.is_valid():
                attachment = form.save(commit=False)
                if item:
                    attachment.actionItem = item
                attachment.user = student
                attachment.attacher = self.request.user
                attachment.date_attached = timezone.now()
                attachment.competency = competency
                attachment.init_file_name_and_type(request.FILES['attachment'].name)
                attachment.save()
            else:
                messages.error(request, 'Failed to save screen recording')

        return redirect(reverse('competency', args=[competency_id]))


def competency_audio_record(request, competency_id=None, student_id=None, item_id=None):
    if item_id:
        item = get_object_or_404(ActionItemAssessment, pk=item_id)
        competency = get_object_or_404(Competency, pk=item.competency.id)
        student = get_object_or_404(User, pk=item.student.id)
    else:
        competency = get_object_or_404(Competency, pk=competency_id)
        student = get_object_or_404(User, pk=student_id)

    context = {
        'competency': competency,
    }

    return render(request, 'dashboard/competency-audio-record.html', context)


def notify_about_student_activity(user, student, roadmap, **notification_kwargs):
    if user.company.users_can_assign_specific_coaches_for_specific_roadmaps:
        for assigned_roadmap in AssignedRoadmap.objects.filter(student=student, roadmap=roadmap):
            notify.send(student, recipient=assigned_roadmap.coach, **notification_kwargs)
    else:
        for coach in student.coach.all():
            notify.send(student, recipient=coach, **notification_kwargs)


def notify_about_new_comment(comment):
    user = comment.user
    student = comment.student
    if user != student:
        notify.send(user, recipient=student, verb=Notification.COMMENTED, target=comment)
    else:
        notify_about_student_activity(
            user, student, comment.competency.roadmap, verb=Notification.COMMENTED, target=comment)


class CompetencyCommentsView(View):
    def post(self, request, student_id, competency_id):
        student = get_object_or_404(User.objects, pk=student_id)
        competency = get_object_or_404(Competency, pk=competency_id)
        user_groups = self.request.user.group_names

        if not self.request.user.can_access_user(student):
            raise Http404

        comment = Comment.objects.create(
            user=self.request.user,
            competency=competency,
            student=student,
            date=timezone.now(),
            text=self.request.POST.get('comment'),
        )
        notify_about_new_comment(comment)
        if self.request.user != student:
            return redirect(reverse_lazy('user_competency_observe', args=[student_id, competency_id]))

        return redirect(reverse_lazy('competency', args=[competency_id]))


class CompetencyCommentView(View):
    def delete(self, request, student_id, competency_id, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id)
        if comment.user != self.request.user:
            raise Http404
        comment.delete()
        return HttpResponse(status=204)

class SCMList(generic.ListView):
    model = User

    def get_template_names(self):
        if self.request.user.is_admin() or self.request.user.is_cohort_admin():
            template_name = 'dashboard/scm-list.html'
        else:
            template_name = 'dashboard/access_denied.html'
        return [template_name]

    def get_queryset(self):
        if 'cohort_id' in self.kwargs:
            users = User.objects.filter(cohort=self.kwargs['cohort_id']).prefetch_related('cohort')
        else:
            name = get_singular_from_plural(self.kwargs['who']).capitalize()
            group = models.Group.objects.get(name=name)
            if self.request.user.company:
                company_id=self.request.user.company.id
            else:
                company_id = 0

            if company_id > 1: #Normal company accounts
                users = group.user_set.filter(company_id=company_id).order_by('first_name','last_name')
            elif company_id == 0: #Super account
                users = group.user_set.all().order_by('company__name','first_name','last_name')
            elif company_id == 1: #General MyRoadmap account (don't show any users)
                users = []
        return users

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if 'cohort_id' in self.kwargs:
            cohort = Cohort.objects.get(pk=self.kwargs['cohort_id'])
            context['who'] = cohort
            context['cohort'] = cohort
        else:
            context['who'] = self.kwargs['who'].capitalize()
        return context


def action_items(request):
    context = {}
    return render(request, 'dashboard/action-items-index.html', context)

def follow_up_items(request):
    context = {}
    return render(request, 'dashboard/follow-up-items-index.html', context)

def questions(request):
    context = {}
    return render(request, 'dashboard/questions-index.html', context)

def content(request):
    context = {}
    return render(request, 'dashboard/content-index.html', context)

class ProfileDetailView(generic.DetailView):
    model = User

    def get_template_names(self):
        if is_approved(self.request.user):
            template_name = "dashboard/profile_detail.html"
        else:
            template_name = "dashboard/non-approved.html"
        return [template_name]

    def get_context_data(self, **kwargs):
        who = self.kwargs.get('pk')
        user = User.objects.get(id=who)
        context = super().get_context_data(**kwargs)
        if self.request.user.company.users_can_assign_specific_coaches_for_specific_roadmaps and self.request.user.is_coach() and not self.request.user.is_admin():
            roadmaps = []
            for assignment in user.get_current_assigned_roadmaps():
                if assignment.coach == self.request.user and assignment.roadmap.company == self.request.user.company:
                    roadmaps.append(assignment.roadmap)
            context['roadmaps'] = roadmaps
            archived_roadmaps = []
        else:
            context['roadmaps'] = user.roadmaps.filter(company=self.request.user.company).extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
            archived_roadmaps = user.archived_roadmaps.filter(company=self.request.user.company).extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
        user.archived_roadmaps_list = archived_roadmaps
        for roadmap in context['roadmaps']:
            roadmap.stages_info = get_stages_with_progress(user, roadmap.id)
            first_assessment = Assessment.objects.filter(competency__stage__roadmap=roadmap, student=user).order_by('id').first()
            roadmap.started = first_assessment.date if first_assessment else None
        if self.request.GET.get('d'):
            context['from_dashboard'] = True
        context['user'] = user
        context['can_access'] = self.request.user.can_access_user(user)
        context['is_my_coach'] = user in self.request.user.coach.all()
        context['follow_up_items'] = FollowUpItem.objects.filter(student=user).order_by('due_date')
        if user.is_coach():
            context['students'] = User.objects.filter(company=self.request.user.company, coach=who)
        elif user.is_mentor():
            context['students'] = User.objects.filter(company=self.request.user.company, mentors__id__exact=who)
        context['from_users'] = self.kwargs.get('from_users')

        return context


class GlobalActionItemDetail(View):
    def post(self, request, pk):
        if 'action' in request.POST:
            action = request.POST.get('action')
            global_item = get_object_or_404(ActionItemGlobal, pk=pk)

        if request.user.is_admin():
        #or request.user.is_cohort_admin(roadmap.cohort) or request.user.can_edit_template(global_item.competency.stage.roadmap) hopefully, they never have to get to this point
            if action == 'delete':
                global_item.delete()
                return HttpResponse('Deleted!')

            if action == 'edit':
                if 'description' in request.POST:
                    description = request.POST['description']
                    global_item.description = description
                    global_item.save()
                    return HttpResponse('Successfully edited!')
                else:
                    return HttpResponse("Something's missing!", status=404)
                return HttpResponse('Success')
            return HttpResponse("Something has happened!", status=404)

class ActionItemDetail(generic.DetailView):
    model = ActionItemAssessment
    def post(self, request, pk):
        if 'action' in request.POST:
            action = request.POST['action']
            user_groups = self.request.user.group_names
            ai = get_object_or_404(ActionItemAssessment, pk=pk)

            # check if user is authorized
            if ai.student == request.user or 'Coach' in user_groups:
                if action == 'edit':
                    if not ai.parent:
                        if 'description' in request.POST and 'due_date' in request.POST:
                            description = request.POST['description']
                            due_date = request.POST['due_date']
                            try:
                                date = datetime.datetime.strptime(due_date, '%m/%d/%Y')
                            except ValueError:
                                return HttpResponse('Not a valid date!')
                            ai.description = description
                            ai.due_date = date
                            ai.save()
                            return HttpResponse('Successfully edited!')
                        else:
                            return HttpResponse("Something's missing!")
                    else:
                        return HttpResponse("Can't edit Global AI!")
                if action == 'delete':
                    if not ai.parent:
                        ai.delete()
                        return HttpResponse('Deleted!')
                    else:
                        return HttpResponse("Global AI can't be deleted!")
                if action == 'archive':
                    ai.archived = not ai.archived
                    ai.save()
                    return HttpResponse('toggled archive!')
                if action == 'mark-done':
                    ai.marked_done = True
                    ai.date_marked_done = datetime.date.today()
                    if (ai.parent):
                        resolutions = ",".join(ai.parent.resolutions)
                        if (resolutions.find('requires_approval') == -1):
                            ai.approved_done = True
                            ai.date_approved_done = datetime.date.today()
                            ai.save()
                            # marked done
                            return HttpResponse(datetime.date.today().strftime('%b. %d, %Y'))
                    notify_about_student_activity(request.user, request.user, ai.competency.roadmap,
                                                  verb=Notification.AI_NEEDS_APPROVAL, target=ai.competency)
                    ai.save()
                    # marked done
                    return HttpResponse(datetime.date.today().strftime('%b. %d, %Y'))
                # coach-specific actions
                if 'Coach' in user_groups or 'User' in user_groups:
                    if action == 'mark-reviewed-done':
                        ai.date_approved_done = datetime.date.today()
                        ai.approved_done = True
                        ai.save()
                        notify.send(request.user, recipient=ai.student, verb=Notification.AI_APPROVED, target=ai.competency)
                        return HttpResponse('Approved done')
                    if action == 'unmark-done':
                        ai.date_marked_done = None
                        ai.marked_done = False
                        ai.save()
                        return HttpResponse('Unmarked done')
                    if action == 'remove-approval':
                        ai.approved_done = False
                        ai.date_approved_done = None
                        ai.save()
                        return HttpResponse('Removed approval')
            else:
                return HttpResponse('Not authorized, sorry')

class FollowUpItemDetail(generic.DetailView):
    model = FollowUpItem
    def post(self, request, pk):
        if 'action' in request.POST:
            action = request.POST['action']
            user_groups = self.request.user.group_names
            fui = get_object_or_404(FollowUpItem, pk=pk)

            # check if user is authorized
            if fui.student == request.user or 'Coach' in user_groups or 'Admin' in user_groups:
                if action == 'edit':
                    if 'due_date' in request.POST:
                        due_date = request.POST['due_date']
                        try:
                            date = datetime.datetime.strptime(due_date, '%m/%d/%Y')
                        except ValueError:
                            return HttpResponse('Not a valid date!')
                        fui.due_date = date
                        fui.save()
                        return HttpResponse('Successfully edited!')
                    else:
                        return HttpResponse("Something's missing!")
                if action == 'delete':
                    fui.delete()
                    return HttpResponse('Deleted!')
                if action == 'archive':
                    fui.archived = not fui.archived
                    fui.save()
                    return HttpResponse('toggled archive!')
                if action == 'successfully-contacted':
                    fui.contacted = True
                    fui.marked_done = True
                    fui.attempted_to_contact = False
                    fui.no_attempt_to_contact = False
                    fui.date_marked_done = datetime.date.today()
                    fui.save()
                    # marked done
                    return HttpResponse(datetime.date.today().strftime('%b. %d, %Y'))
                if action == 'attempted-to-contact':
                    fui.attempted_to_contact = True
                    fui.marked_done = True
                    fui.contacted = False
                    fui.no_attempt_to_contact = False
                    fui.date_marked_done = datetime.date.today()
                    fui.save()
                    # marked done
                    return HttpResponse(datetime.date.today().strftime('%b. %d, %Y'))
                if action == 'no-attempt-to-contacted':
                    fui.no_attempt_to_contact = True
                    fui.marked_done = True
                    fui.contacted = False
                    fui.attempted_to_contact = False
                    fui.date_marked_done = datetime.date.today()
                    fui.save()
                    # marked done
                    return HttpResponse(datetime.date.today().strftime('%b. %d, %Y'))
                # coach-specific actions
                if 'Coach' in user_groups or 'User' in user_groups:
                    if action == 'unmark-done':
                        fui.date_marked_done = None
                        fui.marked_done = False
                        fui.save()
                        return HttpResponse('Unmarked done')
            else:
                return HttpResponse('Not authorized, sorry')

class GlobalQuestionDetail(View):
    def post(self, request, pk):
        if 'action' in request.POST:
            action = request.POST.get('action')
            global_item = get_object_or_404(QuestionGlobal, pk=pk)

        if request.user.is_admin():
        #or request.user.is_cohort_admin(roadmap.cohort) or request.user.can_edit_template(global_item.competency.stage.roadmap) hopefully, they never have to get to this point
            if action == 'delete':
                global_item.delete()
                return HttpResponse('Deleted!')

            if action == 'edit':
                if 'question' in request.POST:
                    question = request.POST['question']
                    global_item.question = question
                    global_item.save()
                    return HttpResponse('Successfully edited!')
                else:
                    return HttpResponse("Something's missing!", status=404)
                return HttpResponse('Success')
            return HttpResponse("Something has happened!", status=404)


class QuestionDetail(generic.DetailView):
    model = QuestionAnswer
    def post(self, request, pk):
        if 'action' in request.POST:
            action = request.POST['action']
            user_groups = self.request.user.group_names
            q = get_object_or_404(ActionItemAssessment, pk=pk)

            # check if user is authorized
            if q.student == request.user or 'Coach' in user_groups:
                if action == 'edit':
                    if not q.parent:
                        if 'quesion' in request.POST in request.POST:
                            question = request.POST['question']
                            q.question = question
                            q.save()
                            return HttpResponse('Successfully edited!')
                        else:
                            return HttpResponse("Something's missing!")
                    else:
                        return HttpResponse("Can't edit Global Questions!")
                if action == 'delete':
                    if not q.parent:
                        q.delete()
                        return HttpResponse('Deleted!')
                    else:
                        return HttpResponse("Global Questions can't be deleted!")

            else:
                return HttpResponse('Not authorized, sorry')


class GlobalContentDetail(View):
    def post(self, request, pk):
        if 'action' in request.POST:
            action = request.POST.get('action')
            global_item = get_object_or_404(ContentGlobal, pk=pk)

        if request.user.is_admin():
            if action == 'delete':
                global_item.delete()
                return HttpResponse('Deleted!')

            if action == 'edit':
                if 'title' in request.POST:
                    title = request.POST['title']
                    global_item.title = title
                    global_item.save()
                    return HttpResponse('Successfully edited!')
                else:
                    return HttpResponse("Something's missing!", status=404)
                return HttpResponse('Success')
            return HttpResponse("Something has happened!", status=404)


class ContentDetail(generic.DetailView):
    model = ContentResponse
    def post(self, request, pk):
        if 'action' in request.POST:
            action = request.POST['action']
            user_groups = self.request.user.group_names
            c = get_object_or_404(ActionItemAssessment, pk=pk)

            # check if user is authorized
            if c.student == request.user or 'Coach' in user_groups:
                if action == 'edit':
                    if not c.parent:
                        if 'content' in request.POST in request.POST:
                            content = request.POST['content']
                            c.content = content
                            c.save()
                            return HttpResponse('Successfully edited!')
                        else:
                            return HttpResponse("Something's missing!")
                    else:
                        return HttpResponse("Can't edit Global Questions!")
                if action == 'delete':
                    if not c.parent:
                        c.delete()
                        return HttpResponse('Deleted!')
                    else:
                        return HttpResponse("Global Questions can't be deleted!")

            else:
                return HttpResponse('Not authorized, sorry')

@login_required
@user_passes_test(lambda u: u.is_superuser)
def staff_companies(request):
    companies = Company.objects.all()
    context = {
        'companies': companies,
    }
    return render(request, 'dashboard/staff-companies.html', context)


@login_required
@user_passes_test(lambda u: u.is_superuser)
def staff_companies_add_edit(request, pk=None):
    if pk:
        company = get_object_or_404(Company, pk=pk)
    else:
        company = None
    if request.POST.get('delete'):
        company.delete()
        return redirect('staff_companies')
    if request.method == 'POST':
        form = StaffCompanyForm(request.POST, request.FILES, instance=company)
        if form.is_valid():
            form.save()
            return redirect('staff_companies')
    else:
        form = StaffCompanyForm(instance=company)

    context = {
        'form': form,
        'company': company,
    }
    return render(request, 'dashboard/staff-companies-add-edit.html', context=context)

@login_required
@user_passes_test(lambda u: u.is_coach)
def coach_users_edit(request, pk=None):
    if pk:
        company = get_object_or_404(Company, pk=pk)
    else:
        company = None
    if request.method == 'POST':
        form = CoachUserForm(request.POST)
        if form.is_valid():
            form.save()
            # return redirect('staff_companies')
    else:
        form = CoachUserForm(instance=company)

    context = {
        'form': form,
        'company': company,
    }
    return render(request, 'dashboard/coach-users-edit.html', context=context)


@login_required
@user_passes_test(lambda u: u.is_admin())
def staff_users(request):
    filter_role = request.GET.get('role')
    if request.user.is_superuser and filter_role is None:
        filter_role = 'admin'
    users = User.objects.filter(company=request.user.company).distinct()
    if not request.user.is_superuser:
        if request.user.cohort.exists():
            users = users.filter(cohort__in=request.user.cohort.all())
        else:
            users = users.filter(company=request.user.company)
    if filter_role and filter_role != 'all':
        users = users.filter(groups__name=filter_role)
    context = {
        'filter_role': filter_role,
        'users': users,
    }
    return render(request, 'dashboard/staff-users.html', context)


@login_required
@user_passes_test(lambda u: u.is_admin())
def staff_users_add_edit(request, pk=None):
    quick_add = True if request.GET.get('qa') else False
    roadmaps_assigned_to_all_users = Roadmap.objects.filter(assign_to_all_users=True,company=request.user.company)
    if pk:
        users = User.objects.all()
        if not request.user.is_superuser:
            if request.user.cohort.exists():
                # admins in cohorts can only edit other users in their cohorts
                users = users.filter(cohort__in=request.user.cohort.all())
            else:
                users = users.filter(company=request.user.company)
        user = get_object_or_404(users, pk=pk)
    else:
        user = None
    # If admin deletes user, then remove the assigned company record and company from companies field
    if request.POST.get('delete'):
        user.delete()
        return redirect('staff_users')
    if request.method == 'POST':
        if quick_add:
            form = StaffQuickAddUser(request.POST, request=request)
        else:
            form = StaffUserForm(request.POST, request.FILES, instance=user, request=request)
        if form.is_valid():
            new_user = form.save(commit=False)
            try:
                new_user.company
            except Company.DoesNotExist:
                new_user.company = request.user.company
            # If adding a new user
            if not user:
                new_user.is_approved = True
            new_user.username = str(uuid.uuid4())
            if not new_user.password:
                new_user.password = ''
            if not new_user.email:
                new_user.email = None
            new_user.save()
            coaches = form.cleaned_data['coach']
            new_coaches = set(coaches).difference(set(new_user.coach.all()))
            if new_coaches:
                send_new_assigned_user_email(request, new_user, new_coaches)
                if pk:
                    util.send_email_from_django_frontend(
                        'MyRoadmap - Meet your new {}'.format(request.user.company.coach_synonym),
                        'A new {} has been added to your account.'.format(request.user.company.coach_synonym),
                        new_user,
                        'dashboard/new_assigned_coach_html.html',
                        primary_link='/',
                        additional_context={
                            'is_coach': False,
                            'coaches': new_coaches,
                            'coaches_count': len(new_coaches),
                        }
                    )
            # TODO need to track coaches on assigned companies table
            # Remove all coaches and roadmaps for this company, and add the details from form
            company_coaches = User.objects.filter(groups__name="Coach", company=request.user.company).distinct()
            new_user.coach.remove(*company_coaches)
            new_user.coach.add(*form.cleaned_data['coach'])
            company_roadmaps = Roadmap.objects.filter(company=request.user.company)
            new_user.roadmaps.remove(*company_roadmaps)
            new_user.roadmaps.add(*form.cleaned_data['roadmaps'])
            if quick_add:
                new_user.groups.set(Group.objects.filter(name='User'))
                new_user.cohort.set(Cohort.objects.filter(id=form.cleaned_data['default_cohort']))
            else:
                new_user.groups.set(form.cleaned_data['groups'])
                new_user.cohort.set(form.cleaned_data['cohort'])
            # If new user, add assigned_company data with inputs from form
            if not user:
                send_new_user_email(request, new_user)
                messages.success(request, 'Account added successfully.')
            else:
                user.groups.set(form.cleaned_data['groups'])
                user.cohort.set(form.cleaned_data['cohort'])
                try:
                    is_approved = form.data['is_approved']
                    user.is_approved = bool(is_approved)
                except:
                    user.is_approved = False
                user.save()
                messages.success(request, 'Account updated successfully.')
            return redirect('staff_users')
    else:
        if quick_add:
            form = StaffQuickAddUser(request=request)
        else:
            form = StaffUserForm(instance=user, request=request)

    context = {
        'form': form,
        'user': user,
        'roadmaps_assigned_to_all_users': roadmaps_assigned_to_all_users,
        'quick_add': quick_add
    }
    return render(request, 'dashboard/staff-users-add-edit.html', context=context)


@login_required
@user_passes_test(lambda u: u.is_admin())
def staff_users_send_welcome_email(request, pk=None):
    if pk:
        users = User.objects.all()
        user = get_object_or_404(users, pk=pk)
    else:
        user = None
    messages.success(request, 'Email sent successfully.')
    send_new_user_email(request, user)
    return redirect('staff_users')



@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def archive_roadmap(request, roadmap_id, student_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    user = get_object_or_404(User, pk=student_id)
    user.roadmaps.remove(roadmap)
    user.archived_roadmaps.add(roadmap)
    return redirect('staff_edit_user_roadmaps', student_id)

@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def remove_roadmap(request, roadmap_id, student_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    user = get_object_or_404(User, pk=student_id)
    user.roadmaps.remove(roadmap)
    return redirect('staff_edit_user_roadmaps', student_id)

@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def assign_roadmap(request, roadmap_id, student_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    user = get_object_or_404(User, pk=student_id)
    user.roadmaps.add(roadmap)
    try:
        previous_date_assigned = RoadmapAssignment.objects.get(user=user, roadmap=roadmap)
        previous_date_assigned.delete()
    except RoadmapAssignment.DoesNotExist:
        previous_date_assigned = None
    RoadmapAssignment.objects.create(user=user, roadmap=roadmap, date_assigned=timezone.now())
    user.archived_roadmaps.remove(roadmap)
    return redirect('staff_edit_user_roadmaps', student_id)

@login_required
# @user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def assign_coach(request, roadmap_id, student_id, coach_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    user = get_object_or_404(User, pk=student_id)
    coach = get_object_or_404(User, pk=coach_id)
    assigned_roadmap = AssignedRoadmap.objects.create(roadmap=roadmap, student=user, coach=coach)
    user.assigned_roadmaps.add(assigned_roadmap)
    user.coach.add(coach)
    return redirect('user_edit_assigned_coaches', roadmap_id)

@login_required
# @user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def remove_coach(request, roadmap_id, student_id, coach_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    user = get_object_or_404(User, pk=student_id)
    coach = get_object_or_404(User, pk=coach_id)
    assigned_roadmap = AssignedRoadmap.objects.filter(roadmap=roadmap, student=user, coach=coach).first()
    assigned_roadmap.delete()
    user.coach.remove(coach)
    return redirect('user_edit_assigned_coaches', roadmap_id)

@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def reassign_roadmap(request, roadmap_id, student_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    user = get_object_or_404(User, pk=student_id)
    user.roadmaps.add(roadmap)
    user.archived_roadmaps.remove(roadmap)
    return redirect('staff_edit_user_roadmaps', student_id)

@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def staff_edit_user_roadmaps(request, student_id):
    student = get_object_or_404(User, pk=student_id)
    student_cohorts = student.cohort.all()
    if request.user.company.users_can_assign_specific_coaches_for_specific_roadmaps and request.user.is_coach() and not request.user.is_admin():
        roadmap_list = []
        archived_roadmaps_list = []
        for assignment in student.get_current_assigned_roadmaps():
            if assignment.coach == request.user and assignment.roadmap.company == request.user.company:
                roadmap_list.append(assignment.roadmap.id)
        roadmaps = Roadmap.objects.filter(pk__in=roadmap_list)
        archived_roadmaps = Roadmap.objects.filter(pk__in=archived_roadmaps_list)
    else:
        roadmaps = student.roadmaps.filter(company=request.user.company).extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
        archived_roadmaps = student.archived_roadmaps.filter(company=request.user.company).extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
    for cohort in student_cohorts:
        student_cohort_roadmaps = cohort.roadmaps.filter(company=request.user.company)
    if not student_cohorts:
        student_cohort_roadmaps = roadmaps
    if request.user.company.archive_roadmaps:
        roadmap_templates = Roadmap.objects.order_by('title').filter(company=request.user.company).exclude(id__in=[r.id for r in roadmaps]).exclude(id__in=[r.id for r in archived_roadmaps])
    else:
        roadmap_templates = Roadmap.objects.order_by('title').filter(company=request.user.company).exclude(id__in=[r.id for r in roadmaps])
    name = student.get_full_name
    student_id = student.id

    company_unassigned_roadmaps = Roadmap.objects.filter(company=request.user.company, cohorts=None)
    combine = company_unassigned_roadmaps | student_cohort_roadmaps
    total = combine.distinct().exclude(id__in=[r.id for r in roadmaps]).exclude(id__in=[r.id for r in archived_roadmaps])

    context = {
        'roadmaps': roadmaps,
        'roadmap_templates': roadmap_templates,
        'archived_roadmaps': archived_roadmaps,
        'name': name,
        'student_id': student_id,
        'student_cohorts': student_cohorts,
        'student_cohort_roadmaps': student_cohort_roadmaps,
        'company_unassigned_roadmaps': company_unassigned_roadmaps,
        'total': total,
    }

    return render(request, 'dashboard/staff-edit-user-roadmaps.html', context=context)

@login_required
# @user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def user_edit_assigned_coaches(request, roadmap_id):
    student = request.user
    company = request.user.company
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    assigned_roadmaps = student.get_current_assigned_roadmaps(roadmap_id)
    assigned_coaches = []
    coach_templates = list(User.objects.filter(groups__name="Coach", company=company, students=student).distinct())

    for assignment in assigned_roadmaps:
        assigned_coaches.append(assignment.coach)
        coach_templates.remove(assignment.coach)

    roadmaps = student.roadmaps.all().extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')

    name = student.get_full_name
    student_id = student.id

    context = {
        'assigned_coaches': assigned_coaches,
        'roadmap': roadmap,
        'roadmap_id': roadmap.id,
        'coach_templates': coach_templates,
        'name': name,
        'student_id': student_id,
    }

    return render(request, 'dashboard/user-edit-assigned-coaches.html', context=context)


@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def add_user_specific_objective(request, student_id, stage_id):
    student = get_object_or_404(User, pk=student_id)
    stage = get_object_or_404(Stage, pk=stage_id)
    roadmap_id = stage.roadmap_id
    if request.method == 'POST':
        form = AddEditUserSpecificObjective(request.POST)
        if form.is_valid():
            new_competency = form.save(commit=False)
            new_competency.student = student
            new_competency.created = timezone.now()
            new_competency.stage = stage
            new_competency.save()
            # if request.user.is_student():  # if user is student, not coach, alert coaches and mentors
            #     try:
            #         for coach in student.coach.all():
            #             notify.send(request.user, recipient=coach, verb='created a Competency -',
            #                         target=new_competency)
            #     except:
            #         pass
            # else:
            try:
                notify.send(request.user, recipient=student, verb=Notification.NEW_COMPETENCY,
                            target=new_competency)
            except:
                pass
            messages.success(request, 'Objective added successfully.')
            url_1 = reverse('user_roadmap_observe', args=[student_id, roadmap_id])
            url = '{}#stage{}'.format(url_1, stage_id)
            return redirect(url)
    else:
        form = AddEditUserSpecificObjective()
    context = {
        'student_id': student_id,
        'form': form,
        'name': student.get_full_name,
    }
    return render(request, 'dashboard/add-edit-user-specific-objective.html', context=context)


@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def edit_user_specific_objective(request, competency_id):
    competency = get_object_or_404(Competency, pk=competency_id)
    student = competency.student
    student_id = competency.student_id
    roadmap_id = competency.stage.roadmap_id
    stage_id = competency.stage_id

    stage = competency.stage.roadmap
    if request.method == 'POST':
        form = AddEditUserSpecificObjective(request.POST, instance=competency)
        if form.is_valid():
            form.save()
            messages.success(request, 'Objective edited successfully.')
            url_1 = reverse('user_roadmap_observe', args=[student_id, roadmap_id])
            url = '{}#stage{}'.format(url_1, stage_id)
            return redirect(url)
    else:
        form = AddEditUserSpecificObjective(instance=competency)
    context = {
        'form': form,
        'stage': stage,
        'name': student.get_full_name,
    }
    return render(request, 'dashboard/add-edit-user-specific-objective.html', context=context)



@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def delete_user_specific_objective(request, competency_id):
    competency = get_object_or_404(User, pk=competency_id)
    competency.delete()
    messages.success(request, 'User specific objective deleted successfully.')
    return redirect('dashboard')


@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def hide_user_objective(request, student_id, competency_id):
    competency = get_object_or_404(Competency, pk=competency_id)
    student = get_object_or_404(User, pk=student_id)
    roadmap_id = competency.stage.roadmap_id
    stage_id = competency.stage_id
    competency.hidden_for.add(student)
    messages.success(request, 'Objective successfully hidden')
    url_1 = reverse('user_roadmap_observe', args=[student.id, roadmap_id])
    url = '{}#stage{}'.format(url_1, stage_id)
    return redirect(url)



@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def unhide_user_objective(request, student_id, competency_id):
    competency = get_object_or_404(Competency, pk=competency_id)
    student = get_object_or_404(User, pk=student_id)
    roadmap_id = competency.stage.roadmap_id
    stage_id = competency.stage_id
    competency.hidden_for.remove(student)
    messages.success(request, 'Objective successfully made visible')
    url_1 = reverse('user_roadmap_observe', args=[student.id, roadmap_id])
    url = '{}#stage{}'.format(url_1, stage_id)
    return redirect(url)

@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def hide_all_stage_objectives(request, student_id, stage_id):
    stage = get_object_or_404(Stage, pk=stage_id)
    student = get_object_or_404(User, pk=student_id)
    stage_competencies = Competency.objects.filter(stage=stage, student__isnull=True)
    user_defined_stage_competencies = Competency.objects.filter(stage=stage, student=student)
    total = stage_competencies | user_defined_stage_competencies
    for competency in total:
        competency.hidden_for.add(student)
    roadmap_id = stage.roadmap_id
    messages.success(request, 'All objective for this stage successfully hidden')
    url_1 = reverse('user_roadmap_observe', args=[student.id, roadmap_id])
    url = '{}#stage{}'.format(url_1, stage_id)
    return redirect(url)

@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def show_all_stage_objectives(request, student_id, stage_id):
    stage = get_object_or_404(Stage, pk=stage_id)
    student = get_object_or_404(User, pk=student_id)
    stage_competencies = Competency.objects.filter(stage=stage, student__isnull=True)
    user_defined_stage_competencies = Competency.objects.filter(stage=stage, student=student)
    total = stage_competencies | user_defined_stage_competencies
    for competency in total:
        competency.hidden_for.remove(student)
    roadmap_id = stage.roadmap_id
    messages.success(request, 'All objective for this stage successfully hidden')
    url_1 = reverse('user_roadmap_observe', args=[student.id, roadmap_id])
    url = '{}#stage{}'.format(url_1, stage_id)
    return redirect(url)




@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin())
def staff_edit_roadmap_cohorts(request, roadmap_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    cohorts = Cohort.objects.filter(company=request.user.company).order_by('title')
    current_cohorts = roadmap.cohorts.all()
    available_cohorts = Cohort.objects.all().filter(company=request.user.company).exclude(id__in=[c.id for c in current_cohorts])

    context = {
        # 'cohorts': cohorts,
        'roadmap': roadmap,
        'available_cohorts': available_cohorts,
        'current_cohorts': current_cohorts,
    }

    return render(request, 'dashboard/staff-edit-roadmap-cohorts.html', context=context)


@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin())
def assign_roadmap_to_group(request, roadmap_id, cohort_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    cohort = get_object_or_404(Cohort, pk=cohort_id)
    roadmap.cohorts.add(cohort)
    cohort.roadmaps.add(roadmap)
    return redirect('staff_edit_roadmap_cohorts', roadmap_id)

@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin())
def unassign_roadmap_to_group(request, roadmap_id, cohort_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    cohort = get_object_or_404(Cohort, pk=cohort_id)
    roadmap.cohorts.remove(cohort)
    cohort.roadmaps.remove(roadmap)
    return redirect('staff_edit_roadmap_cohorts', roadmap_id)


@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin())
def pin_roadmap(request, roadmap_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    roadmap.pinned = True
    roadmap.save()
    messages.success(request, 'Roadmap updated successfully')
    return redirect('staff_roadmap_edit', roadmap_id)


@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin())
def unpin_roadmap(request, roadmap_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    roadmap.pinned = False
    roadmap.save()
    messages.success(request, 'Roadmap updated successfully')
    return redirect('staff_roadmap_edit', roadmap_id)


@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin())
def hide_roadmap_from_users(request, roadmap_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    roadmap.hidden_from_users = True
    roadmap.save()
    messages.success(request, 'Roadmap updated successfully')
    return redirect('staff_roadmap_edit', roadmap_id)


@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin())
def unhide_roadmap_from_users(request, roadmap_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    roadmap.hidden_from_users = False
    roadmap.save()
    messages.success(request, 'Roadmap updated successfully')
    return redirect('staff_roadmap_edit', roadmap_id)



@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin())
def assign_roadmap_to_all_users(request, roadmap_id):
    users = User.objects.all().filter(company=request.user.company)
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    roadmap.assign_to_all_users = True
    for user in users:
        user.roadmaps.add(roadmap)
    roadmap.save()
    messages.success(request, 'Roadmap updated successfully')
    return redirect('staff_roadmap_edit', roadmap_id)


@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin())
def unassign_roadmap_to_all_users(request, roadmap_id):
    users = User.objects.all().filter(company=request.user.company)
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    roadmap.assign_to_all_users = False
    for user in users:
        user.roadmaps.remove(roadmap)
    roadmap.save()
    messages.success(request, 'Roadmap updated successfully')
    return redirect('staff_roadmap_edit', roadmap_id)


@login_required
@user_passes_test(lambda u: u.is_cohort_admin() or u.is_admin() or u.is_coach())
def coach_users_add_edit(request, pk=None):
    if pk:
        users = User.objects.all()
        if not request.user.is_superuser:
            users = users.filter(company=request.user.company)
        user = get_object_or_404(users, pk=pk)
    else:
        user = None
    # If admin deletes user, then remove the assigned company record and company from companies field
    if request.POST.get('delete'):
        user.delete()
        return redirect('staff_users')
    if request.method == 'POST':
        form = CoachUserForm(request.POST, request.FILES, instance=user, request=request)
        if form.is_valid():
            new_user = form.save(commit=False)
            if not new_user.company:
                new_user.company = request.user.company
            if not user:
                new_user.is_approved = True
            new_user.save()
            company_roadmaps = Roadmap.objects.filter(company=request.user.company)
            new_user.roadmaps.remove(*company_roadmaps)
            new_user.roadmaps.add(*form.cleaned_data['roadmaps'])
            if user:
                messages.success(request, 'Assigned Roadmap updated successfully.')
            return redirect('dashboard')
    else:
            form = CoachUserForm(instance=user, request=request)

    context = {
        'form': form,
        'user': user,
    }
    return render(request, 'dashboard/coach-users-add-edit.html', context=context)


def send_new_assigned_user_email(request, new_user, new_coaches, home_url=None, unsubscribe_url_generator=None):
    for coach in new_coaches:
        if not coach.unsubscribed and coach.valid_email:
            util.send_email_from_django_frontend(
                'MyRoadmap - Meet your new {}'.format(request.user.company.user_synonym),
                'A new user has been added to your dashboard',
                coach,
                'dashboard/new_assigned_coach_html.html',
                primary_link='/',
                additional_context={
                    'is_coach': True,
                    'new_user': new_user,
                }
            )


def send_new_user_email(request, new_user):
    reset_password_form = DashboardPasswordResetForm(data={'email': new_user.email})
    if reset_password_form.is_valid() and new_user.email and not new_user.email.startswith('_donotsend'):
        reset_password_form.save(
            request=request,
            subject_template_name='registration/new_account_subject.html',
            email_template_name='registration/new_account_text.html',
            html_email_template_name='registration/new_account_html.html',
            extra_email_context={'request': request},
        )



def send_new_competency_in_roadmap_email(request, competency):
    students_assigned_to_roadmap = User.objects.all().filter(roadmaps__id=competency.roadmap.id, unsubscribed=False)
    for student in students_assigned_to_roadmap:
        util.send_email_from_django_frontend(
            'New Competency Added',
            'A new competency has been added to your Roadmap',
            student,
            'dashboard/new_competency_in_roadmap_email.html',
            primary_link=f"/competency/{competency.id}",
            additional_context={
                'title': competency.title,
                'roadmap': competency.roadmap.title,
            }
        )


@login_required
@user_passes_test(lambda u: u.is_admin())
def staff_roadmaps(request):
    roadmaps = Roadmap.objects.filter(company=request.user.company).extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')
    group_roadmaps = Roadmap.objects.filter(company=request.user.company, cohorts__in=request.user.cohort.all()).extra(select={'int_name':"CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')

    # Hide roadmap templates for now
    roadmap_templates = []
    # if request.user.company_id == 1:
    #     roadmap_templates = []
    # else:
    #     roadmap_templates = Roadmap.objects.filter(company_id=1).order_by('title')

    context = {
        'roadmaps': roadmaps,
        'group_roadmaps': group_roadmaps,
        'roadmap_templates': roadmap_templates,
    }
    return render(request, 'dashboard/staff-roadmaps.html', context=context)

@login_required
@user_passes_test(lambda u: u.is_admin())
def staff_roadmap(request, pk=None):
    exited_save_mode = request.GET.get('s')
    if exited_save_mode:
        messages.success(request, 'Roadmap saved successfully.')
    roadmap = get_object_or_404(Roadmap, pk=pk)
    stages = Stage.objects.filter(roadmap=roadmap).order_by('order')
    context = {
        'roadmap': roadmap,
        'stages_info': {'stages': stages},
        'is_template': True,
    }
    return render(request, 'dashboard/roadmap.html', context=context)

@login_required
@user_passes_test(lambda u: u.is_admin())
def staff_edit_roadmap(request, pk=None):
    roadmap = get_object_or_404(Roadmap, pk=pk) if pk else None
    if roadmap.company != request.user.company:
        return HttpResponseForbidden()
    if request.POST.get('delete') == 'true':
        roadmap.delete()
        messages.success(request, 'Roadmap deleted successfully.')
        return redirect('staff_roadmaps')
    elif request.POST.get('clear') == 'true':
        handled = set()
        assessments = []
        for assessment in Assessment.objects.filter(competency__stage__roadmap=roadmap).order_by('-id'):
            key = (assessment.student_id, assessment.competency_id)
            if key not in handled:
                if assessment.status != Assessment.GREY:
                    assessments.append(Assessment(
                        student=assessment.student,
                        user=assessment.student,
                        competency=assessment.competency,
                        status=Assessment.GREY,
                        date=datetime.date.today(),
                        comment='',
                        approved=True,
                    ))
                handled.add(key)
        Assessment.objects.bulk_create(assessments)
        messages.success(request, '{} assessments cleared successfully.'.format(roadmap.title))
        return redirect('staff_roadmaps')
    if request.method == 'POST':
        new_title = request.POST.get('new-title')
        new_description = request.POST.get('new-description')
        if new_title:
            roadmap.title = new_title
            roadmap.save()
            messages.success(request, 'Roadmap saved successfully.')
        if new_description:
            roadmap.description = new_description
            roadmap.save()
            messages.success(request, 'Roadmap saved successfully.')
        return redirect('staff_roadmap', pk=roadmap.id)
    stages = Stage.objects.filter(roadmap=roadmap).order_by('order')
    context = {
        'roadmap': roadmap,
        'stages_info': {'stages': stages},
        'is_template': True,
        'editing': True,
    }
    return render(request, 'dashboard/roadmap.html', context=context)


def ajax_edit_roadmap_title(request):
    roadmap_id = request.POST.get('id')
    new_title = request.POST.get('title')
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    if request.user.is_admin() and request.user.company == roadmap.company:
        roadmap.title = new_title
        roadmap.save()
    response = {}
    response['success'] = True
    return JsonResponse(response)

def ajax_edit_roadmap_description(request):
    roadmap_id = request.POST.get('id')
    new_description = request.POST.get('description')
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    if request.user.is_admin() and request.user.company == roadmap.company:
        roadmap.description = new_description
        roadmap.save()
    response = {}
    response['success'] = True
    return JsonResponse(response)

def ajax_roadmap_icon(request):
    roadmap_id = request.POST.get('id')
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    data = request.FILES['croppedImage']
    url = default_storage.save('images/roadmap_icons/{}.png', File(data))
    roadmap.icon = url
    roadmap.save()
    response = {}
    response['success'] = True
    return JsonResponse({'url': roadmap.get_roadmap_icon_url()})



def embed(request):
    callback = request.GET.get('callback') or request.POST.get('callback')
    url = request.GET.get('url') or request.POST.get('url')
    domain = urllib.parse.urlparse(url).netloc
    no_embed_domains = ['docs.google.com',]
    if domain not in no_embed_domains:
        url_string = 'http://ckeditor.iframe.ly/api/oembed?url=' + url
        data = requests.get(url_string, headers={'referer': 'https://localhost:8000'}).text
    else:
        raise Http404
    response = "%s && %s(%s);" % (callback, callback, data)
    return HttpResponse(response)


@login_required
def ajax_edit_ai_note(request):
    pk = request.POST.get('pk')
    ai = get_object_or_404(ActionItemAssessment, pk=pk)
    notes = request.POST.get('notes')
    ai.notes = notes
    ai.save()
    return HttpResponse('success')

@login_required
def ajax_edit_q_answer(request):
    pk = request.POST.get('pk')
    q = get_object_or_404(QuestionAnswer, pk=pk)
    answer = request.POST.get('answer')
    q.answer = answer
    q.save()
    return HttpResponse('success')

@login_required
def ajax_edit_c_response(request):
    pk = request.POST.get('pk')
    c = get_object_or_404(ContentResponse, pk=pk)
    response = request.POST.get('response')
    c.response = response
    c.save()
    return HttpResponse('success')


def roadmap_add(request, roadmap_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    request.user.roadmaps.add(roadmap)
    return redirect('roadmaps')
    # return redirect(reverse('roadmap', args=[template_roadmap_id]))


def roadmap_remove(request, roadmap_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    request.user.roadmaps.remove(roadmap)
    return redirect('roadmaps')


@login_required
@user_passes_test(lambda u: u.is_admin())
def add_roadmap_template_staff(request, template_roadmap_id):
    roadmap = Roadmap.objects.get(pk=template_roadmap_id)

    if roadmap.company == request.user.company:
        roadmap.id = None
        roadmap.company_id = request.user.company.id # This should work
        roadmap.save()

        for stage in Stage.objects.filter(roadmap_id=template_roadmap_id):
            template_stage_id = stage.id
            stage.id = None
            stage.roadmap_id = roadmap.id
            stage.save()

            for competency in Competency.objects.filter(stage_id=template_stage_id):
                competency.id = None
                competency.stage_id = stage.id
                competency.save()

    return redirect(reverse('staff_roadmaps'))


def copy_competency(competency, new_stage_id=None, use_atomic=True):
    def copy_competency_core():
        copy_competency_id = competency.id
        competency.pk = None
        competency.title = competency.title + " (copy)"
        if new_stage_id:
            competency.stage_id = new_stage_id
        competency.save()

        for action_item in ActionItemGlobal.objects.filter(competency_id=copy_competency_id):
            action_item.pk = None
            action_item.competency_id = competency.id
            action_item.save()

        for question in QuestionGlobal.objects.filter(competency_id=copy_competency_id):
            question.pk = None
            question.competency_id = competency.id
            question.save()

        for attachment in Attachment.objects.filter(competency_id=copy_competency_id):
            attachment.pk = None
            attachment.competency_id = competency.id
            attachment.save()
    if use_atomic:
        with atomic():
            copy_competency_core()
    else:
        copy_competency_core()


def copy_stage(stage, new_roadmap_id=None, use_atomic=True):
    def copy_stage_core():
        copy_stage_id = stage.id
        stage.id = None
        stage.title = stage.title + " (copy)"
        if new_roadmap_id:
            stage.roadmap_id = new_roadmap_id
        stage.save()

        for competency in Competency.objects.filter(stage_id=copy_stage_id):
            copy_competency(competency, new_stage_id=stage.id, use_atomic=False)

    if use_atomic:
        with atomic():
            copy_stage_core()
    else:
        copy_stage_core()


def copy_roadmap(roadmap):
    with atomic():
        roadmap_id = roadmap.pk
        roadmap.pk = None
        roadmap.title = roadmap.title + " (copy)"
        roadmap.is_published = False
        roadmap.save()

        for stage in Stage.objects.filter(roadmap_id=roadmap_id):
            copy_stage(stage, roadmap.id, use_atomic=False)


@login_required
@user_passes_test(lambda u: u.is_admin())
def copy_roadmap_staff(request, pk):
    roadmap = Roadmap.objects.get(pk=pk)

    if roadmap.company == request.user.company:
        copy_roadmap(roadmap)

    messages.success(request, 'Roadmap copied successfully.')

    return redirect(reverse('staff_roadmaps'))


@login_required
@user_passes_test(lambda u: u.is_admin())
def copy_competency_staff(request, pk):
    competency = Competency.objects.get(pk=pk)
    stage_id = competency.stage.id

    if competency.roadmap.company == request.user.company:
        copy_competency(competency)
        messages.success(request, 'Competency/objective copied successfully.')

    url_1 = reverse('staff_roadmap_edit', args=[competency.roadmap.id])
    url = '{}#stage{}'.format(url_1, stage_id)
    return redirect(url)


@login_required
@user_passes_test(lambda u: u.is_admin())
def copy_stage_staff(request, pk):
    stage = Stage.objects.get(pk=pk)

    if stage.roadmap.company == request.user.company:
        copy_stage(stage)

    messages.success(request, 'Stage copied successfully.')

    url_1 = reverse('staff_roadmap_edit', args=[stage.roadmap.id])
    url = '{}#stage{}'.format(url_1, stage.id)
    return redirect(url)


@login_required
@user_passes_test(lambda u: u.is_admin())
def staff_add_roadmap(request):
    roadmap = Roadmap.objects.create(title='Untitled Roadmap', description='', company=request.user.company)
    stage = Stage.objects.create(title='Untitled Stage', roadmap=roadmap, order=1)
    stages = Stage.objects.filter(roadmap=roadmap).order_by('order')
    context = {
        'roadmap': roadmap,
        'stages': stages,
        'is_template': True,
        'editing': True,
    }
    return redirect(reverse('staff_roadmap_edit', args=[roadmap.id]))



@login_required
@user_passes_test(lambda u: u.is_admin() or u.is_coach())
def roadmap_stats(request, roadmap_id):
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    users_set = User.objects.filter(company=request.user.company)

    if request.user.is_coach() and not request.user.is_admin():
        roadmap_students = User.objects.filter(roadmaps=roadmap).filter(coach=request.user.pk).order_by('first_name')

    if request.user.is_admin():
        roadmap_students = User.objects.filter(roadmaps=roadmap).order_by('first_name')

    if request.user.is_coach() and not request.user.is_admin():
        users_set = users_set.filter(coach=request.user.pk)

    roadmap = get_roadmap_stats(roadmap, users_set)
    competency_ids = Competency.objects.filter(stage__roadmap=roadmap).values_list('id', flat=True)

    all_roadmap_competencies = Competency.objects.filter(stage__roadmap=roadmap, user_defined=False)

    for roadmap_student in roadmap_students:
        roadmap_student.assessments = get_competencies_for_roadmap_with_status(roadmap_student, roadmap, user_defined=False)

    lastest_assessments = get_latest_assessments_for_competency_ids_and_student_ids(competency_ids, [user.pk for user in users_set])
    status_percentages = []
    competency_status_counts = {}

    for (student_id, competency_id), assessment_dict in lastest_assessments.items():
        if competency_id not in competency_status_counts:
            competency_status_counts[competency_id] = {'green': 0, 'red': 0}
        if assessment_dict['status'] == Assessment.RED:
            competency_status_counts[competency_id]['red'] += 1
        elif assessment_dict['status'] == Assessment.GREEN:
            competency_status_counts[competency_id]['green'] += 1

    users_count = users_set.count()
    for id in competency_ids:
        completion_portion = 100 / users_count
        if id in competency_status_counts:
            status_percentages.append({
                'id': id,
                'mastery_percentage': math.trunc(competency_status_counts[id]['green'] * completion_portion),
                'needs_help_percentage': math.trunc(competency_status_counts[id]['red'] * completion_portion)
            })

    top_mastered_list = sorted(status_percentages, reverse=True, key=operator.itemgetter('mastery_percentage'))[:3]
    top_needs_help_list = sorted(status_percentages, reverse=True, key=operator.itemgetter('needs_help_percentage'))[:3]

    top_competency_ids = [i['id'] for i in top_mastered_list + top_needs_help_list]
    top_competencies = {c['id']: c['title'] for c in Competency.objects.filter(id__in=top_competency_ids).values('id', 'title')}
    for i in top_mastered_list + top_needs_help_list:
        i['competency_name'] = top_competencies[i['id']]

    context = {
        'roadmap': roadmap,
        'top_mastered_list': top_mastered_list,
        'top_needs_help_list': top_needs_help_list,
        'all_roadmap_competencies': all_roadmap_competencies,
        'roadmap_students': roadmap_students,
    }

    return render(request, 'dashboard/roadmap-stats.html', context)


@login_required
@user_passes_test(lambda u: u.is_admin())
def staff_cohorts(request):
    # if user is assigned groups, he/she is a group admin, show only their groups
    cohorts = request.user.cohort.all()
    can_edit = False
    if not cohorts:
        cohorts = Cohort.objects.filter(company=request.user.company)
        can_edit = True
    base_url = request.build_absolute_uri('/')
    context = {
        'can_edit': can_edit,
        'cohorts': cohorts,
        'base_url': base_url,
    }
    return render(request, 'dashboard/cohorts.html', context)


@login_required
@user_passes_test(lambda u: u.is_admin())
def staff_add_edit_cohorts(request, cohort_id=None):
    base_url = request.build_absolute_uri('/')
    roadmaps = Roadmap.objects.filter(company=request.user.company).all()
    if cohort_id:
        cohort = get_object_or_404(Cohort.objects.filter(company=request.user.company), pk=cohort_id)
    else:
        cohort = None
    if request.POST.get('delete'):
        cohort.delete()
        return redirect('staff_cohorts')
    if request.method == 'POST':
        form = AddEditCohortForm(request.POST, instance=cohort)
        if form.is_valid():
            new_cohort = form.save(commit=False)
            new_cohort.company = request.user.company
            new_cohort.save()
            if cohort:
                messages.success(request, 'Cohort updated successfully.')
            else:
                messages.success(
                    request, 'Group added successfully.')
            return redirect('staff_cohorts')
    else:
        form = AddEditCohortForm(instance=cohort)
    context = {
        'form': form,
        'base_url': base_url,
        'cohort': cohort,
        'roadmaps': roadmaps
    }
    return render(request, 'dashboard/cohorts-add-edit.html', context=context)


@login_required
@user_passes_test(lambda u: u.is_admin())
def staff_cohort(request, cohort_id):
    cohort = get_object_or_404(Cohort.objects.filter(company=request.user.company), pk=cohort_id)
    context = {
        'cohort': cohort,
    }
    return render(request, 'dashboard/cohort.html', context=context)


def ajax_get_competencies(request):
    if request.is_ajax():
        if request.method == 'GET':
            c = {}
            student_id = request.GET['student']
            stage_id = request.GET['stage']
            editing = True if request.GET['editing'] == 'true' else False
            is_template = True if request.GET['is_template'] == 'true' else False
            if not is_template:
                competencies_hidden_info = Competency.objects.filter(stage=stage_id, hidden_for=student_id)
                c['competencies_hidden_info'] = competencies_hidden_info
            if not student_id and is_template:
                student = None
            else:
                student = get_object_or_404(User, pk=student_id)
            unread_competency_ids = []
            if student:
                if request.user in student.coach.all():
                    unread_competency_ids = Notification.objects.filter(sender_object_id=student.pk, recipient_id=request.user.pk, verb__in=[Notification.NEEDS_APPROVAL, Notification.COMMENTED], read=False).values_list('target_object_id', flat=True)
                elif request.user == student:
                    comments_for_me = Comment.objects.filter(student=request.user).values_list('id', flat=True)
                    unread_competency_ids = Notification.objects.filter(read=False, recipient_id=request.user.pk, verb__in=[Notification.NEEDS_WORK, Notification.APPROVED]).values_list('target_object_id', flat=True)
                    unread_comment_competency_ids = Notification.objects.filter(read=False, recipient_id=request.user.pk, verb__in=[Notification.COMMENTED]).values_list('target_object_id', flat=True)

            c['stage'] = get_object_or_404(Stage, pk=stage_id)
            c['competencies_template_info'] = get_competencies_for_stage_with_status_for_template(student, c['stage'], user_defined=False, unread_competency_ids=unread_competency_ids,)
            c['competencies_info'] = get_competencies_for_stage_with_status(student, c['stage'], user_defined=False, hidden_for=student, unread_competency_ids=unread_competency_ids,)
            c['competencies_user_defined_info'] = get_competencies_for_stage_with_status(student, c['stage'], user_defined=True, unread_competency_ids=unread_competency_ids)
            c['editing'] = editing
            c['is_template'] = is_template
            c['student'] = student
            c['observing'] = student and request.user != student
            return render(request, 'dashboard/ajax-table-competencies.html', c)

        if request.method == 'POST':
            assessment_id = request.POST.get('assessment_id')
            assessment = get_object_or_404(Assessment, pk=assessment_id)
            if request.user.can_access_user(assessment.student):
                action = request.POST.get('action')
                if action == 'approve_assessment':
                    assessment.approved = True
                    assessment.rejected = False
                    assessment.reviewer = request.user
                    assessment.review_date = timezone.now()
                    assessment.save()
                    # notify.send(request.user, recipient=assessment.student, verb='approved assessment', target=assessment)
                    notify.send(request.user, recipient=assessment.student, verb=Notification.APPROVED, target=assessment.competency)
                    latest_assessment = get_latest_assessment_for_competency_id(assessment.competency_id, assessment.student_id)
                    return JsonResponse({
                        'competency': assessment.competency.id,
                        'latest_assessment_approved': latest_assessment.approved,
                        'latest_assessment_status': latest_assessment.status
                    })
                elif action == 'reject_assessment':
                    assessment.rejected = True
                    assessment.approved = False
                    assessment.reviewer = request.user
                    assessment.review_date = timezone.now()
                    assessment.save()
                    notify.send(request.user, recipient=assessment.student, verb=Notification.NEEDS_WORK, target=assessment.competency)
                    return HttpResponse()
    else:
        return HttpResponse('not an ajax request')


def ajax_questions(request):
    if request.is_ajax():
        is_all_q = request.GET.get('i') or request.POST.get('i')
        editing = request.GET.get('e') or request.POST.get('e')

        competency = int(request.GET['competency'])
        try:
            user_id = int(request.GET['student'])
        except:
            user_id = None
        c = {}

        user = get_object_or_404(User, pk=user_id) if user_id else None
        if user:
            c['student'] = user
            if is_all_q:
                c['questions'] = get_all_questions(user)
            else:
                c['questions'] = get_questions(user, competency)
        else:
            c['questions'] = get_global_questions(request, competency)
            c['is_template'] = True
        c['is_all_q'] = True if is_all_q else False
        c['editing'] = True if editing else False
        c['observing'] = user and request.user != user
        return render(request, 'dashboard/questions-table.html', c)
    else:
        return HttpResponse('not ajax request')

def _save_q(request):
    result = {}
    form = AddNewQuestionForm(request.POST)
    if form.is_valid():
        competency_id = form.cleaned_data['competency_id']
        competency = get_object_or_404(Competency, pk=competency_id)
        student_id = form.cleaned_data['student_id']
        student = get_object_or_404(User, pk=student_id)
        if request.user.is_coach() or request.user.id == int(student_id):
            QuestionAnswer.objects.create(
                student_id=student_id,
                competency=competency,
                answer=form.cleaned_data['answer'],
            ).save()
        result['success'] = True
        if request.user != student:
            notify.send(request.user, recipient=student, verb=Notification.NEW_QUESTION, target=competency)
    else:
        result['success'] = False
        result['form'] = form
    return result

def _save_global_q(request):
    result = {}
    form = AddNewGlobalQuestionForm(request.POST, request=request)
    if form.is_valid():
        competency_id = form.cleaned_data['competency_id']
        competency = get_object_or_404(Competency, pk=competency_id)
        if request.user.is_admin() and request.user.company == competency.stage.roadmap.company:
            QuestionGlobal.objects.create(
                competency=competency,
                question=form.cleaned_data['question'],
            )
        result['success'] = True
    else:
        result['success'] = False
        result['form'] = form
    return result

def ajax_question_add(request):
    is_global = request.POST.get('g') or request.GET.get('g')
    response = {}
    if request.method == 'POST':
        result = _save_global_q(request) if is_global else _save_q(request)
        if result['success']:
            return HttpResponse('success')
        elif 'form' in result.keys():
            return render(request, 'dashboard/form-add-question.html', {'form' : result['form'], 'is_global': is_global}, status=404)
    else:
        student_id = request.GET.get('student_id')
        competency_id = request.GET.get('competency_id')
        if student_id and competency_id:
            form = AddNewQuestionForm(student_id=student_id, competency_id=competency_id)
        elif is_global and competency_id:
            form = AddNewGlobalQuestionForm(competency_id=competency_id, request=request)
    context = {
            'form': form,
            'is_global': is_global,
        }
    response['modal_html'] = render_to_string('dashboard/form-add-question.html', request=request, context=context)
    return JsonResponse(response)


def ajax_content(request):
    if request.is_ajax():
        is_all_c = request.GET.get('i') or request.POST.get('i')
        editing = request.GET.get('e') or request.POST.get('e')
        competency = int(request.GET['competency'])
        try:
            user_id = int(request.GET['student'])
        except:
            user_id = None
        c = {}

        user = get_object_or_404(User, pk=user_id) if user_id else None
        if user:
            c['student'] = user
            if is_all_c:
                c['content'] = get_all_content(user)
            else:
                c['content'] = get_content(user, competency)
        else:
            c['content'] = get_global_content(request, competency)
            c['is_template'] = True
        c['is_all_c'] = True if is_all_c else False
        c['editing'] = True if editing else False
        c['observing'] = user and request.user != user

        return render(request, 'dashboard/content-table.html', c)
    else:
        return HttpResponse('not ajax request')

def _save_c(request):
    result = {}
    form = AddNewContentForm(request.POST)
    if form.is_valid():
        competency_id = form.cleaned_data['competency_id']
        competency = get_object_or_404(Competency, pk=competency_id)
        student_id = form.cleaned_data['student_id']
        student = get_object_or_404(User, pk=student_id)
        if request.user.is_coach() or request.user.id == int(student_id):
            ContentResponse.objects.create(
                student_id=student_id,
                competency=competency,
                response=form.cleaned_data['response'],
            ).save()
        result['success'] = True
        if request.user != student:
            notify.send(request.user, recipient=student, verb=Notification.NEW_CONTENT, target=competency)
    else:
        result['success'] = False
        result['form'] = form
    return result

def _save_global_c(request):
    result = {}
    form = AddNewGlobalContentForm(request.POST, request=request)
    if form.is_valid():
        competency_id = form.cleaned_data['competency_id']
        competency = get_object_or_404(Competency, pk=competency_id)
        if request.user.is_admin() and request.user.company == competency.stage.roadmap.company:
            ContentGlobal.objects.create(
                competency=competency,
                title=form.cleaned_data['title'],
            )
        result['success'] = True
    else:
        result['success'] = False
        result['form'] = form
    return result

def ajax_content_add(request):
    is_global = request.POST.get('g') or request.GET.get('g')
    response = {}
    if request.method == 'POST':
        result = _save_global_c(request) if is_global else _save_c(request)
        if result['success']:
            return HttpResponse('success')
        elif 'form' in result.keys():
            return render(request, 'dashboard/form-add-content.html', {'form' : result['form'], 'is_global': is_global}, status=404)
    else:
        student_id = request.GET.get('student_id')
        competency_id = request.GET.get('competency_id')
        if student_id and competency_id:
            form = AddNewContentForm(student_id=student_id, competency_id=competency_id)
        elif is_global and competency_id:
            form = AddNewGlobalContentForm(competency_id=competency_id, request=request)
    context = {
            'form': form,
            'is_global': is_global,
        }
    response['modal_html'] = render_to_string('dashboard/form-add-content.html', request=request, context=context)
    return JsonResponse(response)


def ajax_action_items(request):
    if request.is_ajax():
        is_all_ai = request.GET.get('i') or request.POST.get('i')
        editing = request.GET.get('e') or request.POST.get('e')

        competency = int(request.GET['competency'])
        user_groups = request.user.group_names
        try:
            user_id = int(request.GET['student'])
        except:
            user_id = None
        c = {}

        user = get_object_or_404(User, pk=user_id) if user_id else None
        if user:
            c['student'] = user
            if is_all_ai:
                c['action_items'] = get_all_action_items(user, archived=False)
            else:
                c['action_items'] = get_action_items(user, competency, archived=False)
        else:
            c['action_items'] = get_global_action_items(request, competency)
            c['is_template'] = True
        c['user_groups'] = user_groups
        c['competency'] = competency
        c['is_all_ai'] = True if is_all_ai else False
        c['editing'] = True if editing else False
        c['observing'] = user and request.user != user

        return render(request, 'dashboard/action-items-table.html', c)
    else:
        return HttpResponse('not ajax request')


def ajax_follow_up_items(request):
    if request.is_ajax():
        is_all_fui = request.GET.get('i') or request.POST.get('i')
        editing = request.GET.get('e') or request.POST.get('e')
        user_groups = request.user.group_names
        try:
            user_id = int(request.GET['student'])
        except:
            user_id = None
        c = {}

        user = get_object_or_404(User, pk=user_id) if user_id else None
        start_date = date.today() - timedelta(99999)
        end_date = date.today() + timedelta(31)
        if user:
            c['student'] = user
            follow_up_items = FollowUpItem.objects.filter(student=user, marked_done=False).order_by('due_date')
            completed_follow_up_items = FollowUpItem.objects.filter(student=user, marked_done=True).order_by('due_date')
            c['user_specific_items'] = True
        else:
            if request.user.is_admin() and not request.user.is_cohort_admin():
                follow_up_items = FollowUpItem.objects.filter(student__company=request.user.company, marked_done=False, due_date__range=(start_date, end_date)).order_by('due_date')
                completed_follow_up_items = FollowUpItem.objects.filter(student__company=request.user.company, marked_done=True).order_by('due_date')
            if request.user.is_cohort_admin():
                follow_up_items = FollowUpItem.objects.filter(student__cohort__in=request.user.cohort.all(), marked_done=False, due_date__range=(start_date, end_date)).order_by('due_date')
                completed_follow_up_items = FollowUpItem.objects.filter(student__cohort__in=request.user.cohort.all(), marked_done=True).order_by('due_date')
            if request.user.is_coach() and not request.user.is_cohort_admin() and not request.user.is_admin():
                follow_up_items = FollowUpItem.objects.filter(student__coach=request.user.pk, marked_done=False, due_date__range=(start_date, end_date)).order_by('due_date')
                completed_follow_up_items = FollowUpItem.objects.filter(student__coach=request.user.pk, marked_done=True).order_by('due_date')

        c['student'] = user
        c['follow_up_items'] = follow_up_items
        c['completed_follow_up_items'] = completed_follow_up_items
        c['editing'] = True if editing else False

        return render(request, 'dashboard/follow-up-items-table.html', c)
    else:
        return HttpResponse('not ajax request')


def _save_ai(request):
    result = {}
    form = AddNewActionItemForm(request.POST)
    if form.is_valid():
        competency_id = form.cleaned_data['competency_id']
        competency = get_object_or_404(Competency, pk=competency_id)
        student_id = form.cleaned_data['student_id']
        student = get_object_or_404(User, pk=student_id)
        if request.user.is_coach() or request.user.id == int(student_id):
            ActionItemAssessment.objects.create(
                student_id=student_id,
                competency=competency,
                description=form.cleaned_data['description'],
                due_date=form.cleaned_data['due_date'],
            ).save()
        result['success'] = True
        if request.user != student:
            notify.send(request.user, recipient=student, verb=Notification.NEW_ACTION_ITEM, target=competency)
    else:
        result['success'] = False
        result['form'] = form
    return result


def _save_global_ai(request):
    result = {}
    form = AddNewGlobalActionItemForm(request.POST, request=request)
    if form.is_valid():
        try:
            item = ActionItemGlobal.objects.get(pk=request.POST.get('item_id'))
        except:
            item = None
        if (item):
            item.aiTitle = form.cleaned_data['aiTitle']
            item.aiDescription = form.cleaned_data['aiDescription']
            item.resolutions = form.cleaned_data.get('resolutions')
            item.save()
        else:
            competency_id = form.cleaned_data['competency_id']
            competency = get_object_or_404(Competency, pk=competency_id)
            if request.user.is_admin() and request.user.company == competency.stage.roadmap.company:
                ActionItemGlobal.objects.create(
                    competency=competency,
                    aiTitle=form.cleaned_data['aiTitle'],
                    aiDescription=form.cleaned_data['aiDescription'],
                    resolutions=form.cleaned_data.get('resolutions')
                )
        result['success'] = True
    else:
        result['success'] = False
        result['form'] = form
    return result

def ajax_global_action_item_edit(request):
    response = {}
    if request.method == 'POST':
        result = _save_global_ai(request) if is_global else _save_ai(request)
        if result['success']:
            return HttpResponse('success')
        elif 'form' in result.keys():
            return render(request, 'dashboard/form-add-action-item.html', {'form' : result['form'], 'is_global': is_global}, status=404)
    else:
        item_id = request.GET.get('item_id')
        obj = get_object_or_404(ActionItemGlobal, pk=item_id)
        form = EditNewGlobalActionItemForm(instance=obj)
    context = {
            'form': form,
            'is_global': True,
        }
    response['modal_html'] = render_to_string('dashboard/form-add-action-item.html', request=request, context=context)
    return JsonResponse(response)

def ajax_action_item_add(request):
    is_global = request.POST.get('g') or request.GET.get('g')
    response = {}
    if request.method == 'POST':
        result = _save_global_ai(request) if is_global else _save_ai(request)
        if result['success']:
            return HttpResponse('success')
        elif 'form' in result.keys():
            return render(request, 'dashboard/form-add-action-item.html', {'form' : result['form'], 'is_global': is_global}, status=404)
    else:
        student_id = request.GET.get('student_id')
        competency_id = request.GET.get('competency_id')
        if student_id and competency_id:
            form = AddNewActionItemForm(student_id=student_id, competency_id=competency_id)
        elif is_global and competency_id:
            form = AddNewGlobalActionItemForm(competency_id=competency_id, request=request)
    context = {
            'form': form,
            'is_global': is_global,
        }
    response['modal_html'] = render_to_string('dashboard/form-add-action-item.html', request=request, context=context)
    return JsonResponse(response)

def ajax_follow_up_item_add(request):
    response = {}
    if request.method == 'POST':
        result = _save_fui(request)
        if result['success']:
            return HttpResponse('success')
        elif 'form' in result.keys():
            return render(request, 'dashboard/form-add-follow-up-item.html', {'form' : result['form']}, status=404)
    else:
        student_id = request.GET.get('student_id')
        if student_id:
            form = AddNewFollowUpItemForm(student_id=student_id)
    context = {
            'form': form,
        }
    response['modal_html'] = render_to_string('dashboard/form-add-follow-up-item.html', request=request, context=context)
    return JsonResponse(response)

def _save_fui(request):
    result = {}
    form = AddNewFollowUpItemForm(request.POST)
    if form.is_valid():
        student_id = form.cleaned_data['student_id']
        student = get_object_or_404(User, pk=student_id)
        if request.user.is_coach() or request.user.id == int(student_id):
            FollowUpItem.objects.create(
                student_id=student_id,
                due_date=form.cleaned_data['due_date'],
            ).save()
        result['success'] = True
    else:
        result['success'] = False
        result['form'] = form
    return result

def ajax_attachment_delete(request):
    if request.is_ajax():
        response = {'success': True}
        pk = request.POST.get('pk', None)
        attachment = get_object_or_404(Attachment, pk=pk)
        response['removed'] = attachment.id
        attachment.delete()
        return JsonResponse(response)
    else:
        return HttpResponseBadRequest


def ajax_sidebar(request):
    if request.is_ajax():
        user_groups = request.user.group_names
        if 'Coach' in user_groups or 'Mentor' in user_groups:
            order = request.POST.get('order', None)
            request.user.update(sidebar_list=order)
            return HttpResponse(order)


def ajax_profile_pic(request):
    if request.is_ajax():
        who = get_object_or_404(User, pk=request.user.id)
        data = request.FILES['croppedImage']
        def rand_str(n): return ''.join([random.choice(string.ascii_letters + string.digits) for i in range(n)])
        random_filename = rand_str(15)
        url = default_storage.save('images/profiles/{}.png'.format(random_filename), File(data))
        who.photo = url
        who.save()
        return JsonResponse({'url': who.get_photo_url()})
    else:
        return HttpResponse('not supported')

def ajax_profile_pic_delete(request):
    who = get_object_or_404(User, pk=request.user.id)
    who.photo.delete()
    response = {}
    response['success'] = True
    return JsonResponse(response)

# def ajax_delete_comment(request):
#     comment = get_object_or_404(Comment, pk=request.POST['comment'])
#     if comment.user != request.user:
#         raise Http404
#     comment.delete()
#     return JsonResponse({'success': True})



def ajax_edit_stage(request):
    stage_id = request.POST.get('id')
    new_title = request.POST.get('newTitle')
    new_description = request.POST.get('newDescription')
    new_coach_notes = request.POST.get('newCoachNotes')
    if new_title and stage_id:
        stage = get_object_or_404(Stage, pk=stage_id)
        stage.title = new_title
        stage.save()
    if new_description and stage_id:
        stage = get_object_or_404(Stage, pk=stage_id)
        stage.description = new_description
        stage.save()
    if new_coach_notes and stage_id:
        stage = get_object_or_404(Stage, pk=stage_id)
        stage.coach_notes = new_coach_notes
        stage.save()
    response = {}
    response['success'] = True
    return JsonResponse(response)


def ajax_add_stage(request):
    roadmap_id = request.POST.get('roadmap')
    roadmap = get_object_or_404(Roadmap, pk=roadmap_id)
    response = {}
    if request.user.is_admin() and request.user.company == roadmap.company:
        next_stage_order = Stage.objects.filter(roadmap=roadmap).order_by('order').reverse()[0].order + 1
        new_stage = Stage.objects.create(title='Untitled Stage', roadmap=roadmap, order=next_stage_order)
        response['id'] = new_stage.id
    response['success'] = True
    return JsonResponse(response)


def ajax_delete_stage(request):
    response = {'success': True}
    stage_id = request.POST.get('id')
    stage = get_object_or_404(Stage, pk=stage_id)
    if request.user.is_admin() and request.user.company == stage.roadmap.company:
        if stage.roadmap.stage_set.count() == 1:
            response['success'] = False
        else:
            stage.delete()
    return JsonResponse(response)


def ajax_delete_competency(request):
    competency_id = request.POST.get('competency')
    competency = get_object_or_404(Competency, pk=competency_id)
    if request.user.is_admin() and request.user.company == competency.stage.roadmap.company:
        competency.delete()
    response = {}
    response['success'] = True
    return JsonResponse(response)

@atomic
def ajax_sort_action_items(request):
    if request.method == 'POST':
        mapping = json.loads(request.POST.get('orderMapping'))
        is_globals = json.loads(request.POST.get('is_globals'))
        ids = [int(i) for i in mapping.keys()]
        children = None
        if is_globals:
            items = ActionItemGlobal.objects.filter(id__in=ids)
            children = ActionItemAssessment.objects.filter(parent__in=items)
        else:
            items = ActionItemAssessment.objects.filter(id__in=ids)
        for item in items:
            item.order = int(mapping[str(item.id)])
            item.save()
        if children:
            for child in children:
                child.order = int(mapping[str(child.parent.id)])
                child.save()
        response = {}
        response['success'] = True
        return JsonResponse(response)


@atomic
def ajax_sort_questions(request):
    if request.method == 'POST':
        mapping = json.loads(request.POST.get('orderMapping'))
        is_globals = json.loads(request.POST.get('is_globals'))
        ids = [int(i) for i in mapping.keys()]
        children = None
        if is_globals:
            items = QuestionGlobal.objects.filter(id__in=ids)
            children = QuestionAnswer.objects.filter(parent__in=items)
        else:
            items = QuestionAnswer.objects.filter(id__in=ids)
        for item in items:
            item.order = int(mapping[str(item.id)])
            item.save()
        if children:
            for child in children:
                child.order = int(mapping[str(child.parent.id)])
                child.save()
        response = {}
        response['success'] = True
        return JsonResponse(response)


@atomic
def ajax_sort_content(request):
    if request.method == 'POST':
        mapping = json.loads(request.POST.get('orderMapping'))
        is_globals = json.loads(request.POST.get('is_globals'))
        ids = [int(i) for i in mapping.keys()]
        children = None
        if is_globals:
            items = ContentGlobal.objects.filter(id__in=ids)
            children = ContentResponse.filter(parent__in=items)
        else:
            items = ContentResponse.objects.filter(id__in=ids)
        for item in items:
            item.order = int(mapping[str(item.id)])
            item.save()
        if children:
            for child in children:
                child.order = int(mapping[str(child.parent.id)])
                child.save()
        response = {}
        response['success'] = True
        return JsonResponse(response)


@atomic
def ajax_sort_competencies(request):
    stage_id = request.POST.get('stage')
    mapping = json.loads(request.POST.get('orderMapping'))
    competencies = Competency.objects.filter(stage=stage_id)
    if request.user.is_admin() and request.user.company == competencies[0].stage.roadmap.company:
        for competency in competencies:
            competency.order = int(mapping[str(competency.id)])
            competency.save()
    response = {}
    response['success'] = True
    return JsonResponse(response)


def ajax_sort_stages(request):
    roadmap_id = request.POST.get('roadmap')
    mapping = json.loads(request.POST.get('orderMapping'))
    stages = Stage.objects.filter(roadmap=roadmap_id)
    if request.user.is_admin() and request.user.company == stages[0].roadmap.company:
        for stage in stages:
            stage.order = int(mapping[str(stage.id)])
            stage.save()
    response = {}
    response['success'] = True
    return JsonResponse(response)


def ajax_edit_competency_note(request):
    note_id = request.GET.get('id') or request.POST.get('id')
    competency_id = request.GET.get('competencyId')
    if note_id and note_id != '0':
        note = get_object_or_404(Note, pk=note_id)
    elif competency_id:
        note = Note.objects.create(competency_id=competency_id, student_id=request.user.id)
    else:
        raise Http404
    response = {}
    if request.method == 'POST':
        form = EditCompetencyNotes(request.POST, instance=note)
        if form.is_valid():
            result = form.save()
            response['success'] = True
            response['new_text'] = result.text
            if result.text == '':
                result.delete()
            return JsonResponse(response)
    else:
        form = EditCompetencyNotes(instance=note)
    context = {
        'form': form,
        'note_id': note.id,
        'competency': competency_id,
    }
    response['notes_form'] = render_to_string('dashboard/edit-competency-notes-form.html', request=request, context=context)

    return JsonResponse(response)


def ajax_hide_ai(request, pk):
    competency = get_object_or_404(Competency, pk=pk)
    response = {}
    competency.ai_visible = False
    competency.save()
    response['success'] = True
    return JsonResponse(response)


def ajax_show_ai(request, pk):
    competency = get_object_or_404(Competency, pk=pk)
    response = {}
    competency.ai_visible = True
    competency.save()
    response['success'] = True
    return JsonResponse(response)


def ajax_hide_comments(request, pk):
    competency = get_object_or_404(Competency, pk=pk)
    response = {}
    competency.comments_visible = False
    competency.save()
    response['success'] = True
    return JsonResponse(response)


def ajax_show_comments(request, pk):
    competency = get_object_or_404(Competency, pk=pk)
    response = {}
    competency.comments_visible = True
    competency.save()
    response['success'] = True
    return JsonResponse(response)


def ajax_hide_attachments(request, pk):
    competency = get_object_or_404(Competency, pk=pk)
    response = {}
    competency.attachments_visible = False
    competency.save()
    response['success'] = True
    return JsonResponse(response)


def ajax_show_attachments(request, pk):
    competency = get_object_or_404(Competency, pk=pk)
    response = {}
    competency.attachments_visible = True
    competency.save()
    response['success'] = True
    return JsonResponse(response)


def ajax_hide_competency(request, pk):
    competency = get_object_or_404(Competency, pk=pk)
    response = {}
    competency.hidden_for_all_users = True
    competency.save()
    response['success'] = True
    return JsonResponse(response)


def ajax_show_competency(request, pk):
    competency = get_object_or_404(Competency, pk=pk)
    response = {}
    competency.hidden_for_all_users = False
    competency.save()
    response['success'] = True
    return JsonResponse(response)


def ajax_approve_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    response = {}
    if request.user.is_admin():
        user.is_approved = True
        user.save()
        response['success'] = True
        util.send_email_from_django_frontend(
            'Account Approved',
            f'You have been approved to start using MyRoadmap with {user.company}',
            user,
            'dashboard/user_approved_email.html',
            primary_link='/',
            additional_context={
                'approver': request.user,
            }
        )
    return JsonResponse(response)


def ajax_publish_roadmap(request, pk):
    roadmap = get_object_or_404(Roadmap, pk=pk)
    if request.user.is_admin() and request.user.company == roadmap.company:
        roadmap.is_published = request.POST.get('publish') == 'true'
        roadmap.save()
    return JsonResponse({'success': True})


def ajax_register_device(request):
    try:
        WebPushDevice.objects.get(registration_id=request.POST.get('registration_id'))
    except WebPushDevice.DoesNotExist:
        pass
    else:
        return JsonResponse({'success': False})

    device = WebPushDevice(
        registration_id=request.POST.get('registration_id'), browser=request.POST.get('browser'),
        p256dh=request.POST.get('p256dh'), auth=request.POST.get('auth'), name=request.POST.get('name'))
    device.user = request.user
    try:
        device.full_clean()
    except ValidationError:
        success = False
    else:
        device.save()
        success = True
    return JsonResponse({'success': success})


def ajax_assessment_data(request, pk):
    competency = get_object_or_404(Competency, pk=pk)
    user = User.objects.filter(id=request.POST.get('student')).first()
    assessments = Assessment.objects.filter(student=user, competency__id=competency.id).order_by('-id').values()
    return JsonResponse({'success': True, 'assessments': list(assessments)})


def ajax_delete_comment(request):
    comment = get_object_or_404(Comment, pk=request.POST['comment'])
    if comment.user != request.user:
        raise Http404
    comment.delete()
    return JsonResponse({'success': True})


def ajax_choose_active_company(request):
    company = get_object_or_404(Company, pk=request.POST['company'])
    user = User.objects.get(email=request.user.email, company=company)
    login(request, user)
    return JsonResponse({'success': True, 'active_company': user.company.id})


def ajax_save_comment(request):
    # def post(self, request, student_id, competency_id):
    student = get_object_or_404(User.objects, pk=request.POST['studentId'])
    competency = get_object_or_404(Competency, pk=request.POST['competency'])
    user_groups = request.user.group_names

    if not request.user.can_access_user(student):
        raise Http404

    comment = Comment.objects.create(
        user=request.user,
        competency=competency,
        student=student,
        date=timezone.now(),
        text=request.POST.get('comment'),
    )
    notify_about_new_comment(comment)
    return JsonResponse({'success': True, 'comment': {'text': request.POST.get('comment'), 'id': comment.id, 'user': {'fullname': request.user.first_name+" "+request.user.last_name, "firstname": request.user.first_name, "lastname": request.user.last_name, "photo_url": request.user.get_photo_url(), "photo": bool(request.user.photo)}}})


def ajax_save_assessment_data(request):
    if request.POST['studentId'] != '0':
        student = get_object_or_404(User.objects, pk=request.POST['studentId'])
        if not request.user.can_access_user(student):
            raise Http404
        approved = True
    else:
        student = request.user
        approved = False
    competency = get_object_or_404(Competency.objects, pk=request.POST['competency'])
    if 'status' in request.POST:
        assessment = Assessment.objects.create(
            student=student,
            user=request.user,
            competency=competency,
            status=request.POST['status'],
            date=datetime.date.today(),
            comment='',
            approved=approved,
        )
        if assessment.status == Assessment.GREEN and request.user.company.coaches_approve_green_assessments:
            notify_about_student_activity(request.user, student, competency.roadmap, verb=Notification.NEEDS_APPROVAL,
                                          target=competency)
            messages.success(request, 'Competency/Objective now awaits approval.')
    return JsonResponse({'success': True})


class AssessmentViewSet(GenericViewSet,  # generic view functionality
                     CreateModelMixin,  # handles POSTs
                    #  RetrieveModelMixin,  # handles GETs for 1 Company
                    #  UpdateModelMixin,  # handles PUTs and PATCHes
                    #  ListModelMixin   # handles GETs for many Companies
                    ):

      serializer_class = AssessmentSerializer
      queryset = Assessment.objects.all()


class AssessmentAuthorizedViewSet(AuthorizedMixin, AssessmentViewSet):
    pass


class DashboardPostmanWriteView(WriteView):
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs


class DashboardPasswordResetView(auth_views.PasswordResetView):
    email_template_name = 'registration/password_reset_email_text.html',
    html_email_template_name = 'registration/password_reset_email_html.html',

    def form_valid(self, form):
        extra_content = {'request': self.request}
        if self.extra_email_context:
            extra_content.update(self.extra_email_context)
        opts = {
            'use_https': self.request.is_secure(),
            'token_generator': self.token_generator,
            'from_email': self.from_email,
            'email_template_name': self.email_template_name,
            'subject_template_name': self.subject_template_name,
            'request': self.request,
            'html_email_template_name': self.html_email_template_name,
            'extra_email_context': extra_content,
        }
        form.save(**opts)
        email = form.cleaned_data["email"]
        return HttpResponseRedirect(f"{reverse('password_reset_done')}?email={email}")


class DashboardPasswordResetDoneView(auth_views.PasswordResetDoneView):
    def get_context_data(self, **kwargs):
        result = super().get_context_data(**kwargs)
        if 'email' in self.request.GET:
            result['email'] = self.request.GET['email']
        return result


class DashboardNewAccountPasswordResetConfirmView(auth_views.PasswordResetConfirmView):
    def dispatch(self, *args, **kwargs):
        self.request.session['resetting_password_new_account'] = True
        return super().dispatch(*args, **kwargs)


class DashboardPasswordResetConfirmView(auth_views.PasswordResetConfirmView):
    def dispatch(self, *args, **kwargs):
        self.request.session['resetting_password_new_account'] = False
        return super().dispatch(*args, **kwargs)


def revroad_stats(request):
    if request.GET.get('key') == 'rrR693rvX72NsQg2Zlc66ko5e2Loi70ncaermy0GwQ42tJ9d48':
        return JsonResponse({
            'USERS': User.objects.count(),
            'COACHES': User.objects.filter(groups__name='Coach').count(),
            'COMMENTS': Comment.objects.count(),
            'ROADMAPS': Roadmap.objects.count(),
            'OBJECTIVES_ASSESSED': Assessment.objects.values('competency_id').distinct().count(),
        })
    else:
        return HttpResponse('Unauthorized', status=401)


def _get_invite_accept_link(request, email, user, roadmaps, accepted):
    # r=X&r=X
    roadmaps_str_list = []
    for roadmap in roadmaps:
        roadmaps_str_list.append('r='+roadmap)
    roadmaps_str = '&'.join(str(x) for x in roadmaps_str_list)

    return '{}?e={}&u={}&t={}&a={}&c={}&{}'.format(
        reverse('coaches_invite_accept'),
        urllib.parse.quote(email),
        user.id,
        util.get_invite_token(user.id, email),
        '1' if accepted else '0',
        user.company.id,
        roadmaps_str
    )


def coaches_invite(request):
    email = request.GET.get('coach_email') or request.POST.get('coach_email')
    roadmaps = request.POST.getlist('roadmaps')

    if email:
        coach = User.objects.filter(email=email).first()
        if coach and coach.id == request.user.id:
            messages.error(request, 'You can not coach yourself.')
            return redirect(request.META.get('HTTP_REFERER') or 'profile')
        messages.success(
            request, 'Coach invite email sent to {}. You will be notified if they accept your invite.'.format(email))

        links = {'primary_link': _get_invite_accept_link(request, email, request.user, roadmaps, False)}
        if coach:
            links['unsubscribe_url'] = reverse('email_unsubscribe', kwargs={
                'user_id': coach.id,
                'token': User.get_unsubscribe_token(coach.id),
            })
        util.send_email_from_django_frontend(
            '{} - {} invited you to be their coach'.format(request.user.company.name, request.user.get_full_name()),
            'You have been invited to be a coach.',
            request.user,
            'dashboard/email-coach-invitation.html',
            recipients=[email],
            links=links,
            additional_context={
                'invite': True,
            },
        )

    return redirect(request.META.get('HTTP_REFERER') or 'profile')


def coaches_invite_accept(request):
    user_id = request.GET.get('u')
    email = request.GET.get('e')
    token = request.GET.get('t')
    roadmaps = request.GET.getlist('r')
    accepted = request.GET.get('a') == '1'

    # r=X&r=X
    roadmaps_str_list = []
    for roadmap in roadmaps:
        roadmaps_str_list.append('r='+roadmap)
    roadmaps_str = '&'.join(str(x) for x in roadmaps_str_list)

    private_company = None
    private_id = request.GET.get('c')
    if private_id:
        private_company = Company.objects.filter(id=private_id).first()
        if private_company.id == 1:
            private_company = None
        if private_company:
            request.session['private_company_id'] = private_company.id
    else:
        request.session['private_company_id'] = ''

    validate_token = util.get_invite_token(user_id, email)
    if user_id and email and token == validate_token:
        user = User.objects.filter(id=user_id).first()
        if user:
            coach = User.objects.filter(email=email, company=user.company).first()
            accept_invitation_link = ''.format()
            create_new_account_link = '{}?from_coach_invite=true&e={}&u={}&t={}&private_id={}&{}'.format(
                reverse('email_signup'),
                urllib.parse.quote(email),
                user_id,
                validate_token,
                private_id,
                roadmaps_str
            )
            if coach:
                if request.user.is_authenticated and request.user != coach:
                    logout(request)
                if accepted:
                    if not user.coach.filter(pk=coach.pk).exists():
                        util.send_coach_accepted_invitation_email(coach, user)
                    user.coach.add(coach)
                    # If the user's company has specific coaches for specific roadmaps turned on, add roadmap assignments
                    if user.company.users_can_assign_specific_coaches_for_specific_roadmaps:
                        for roadmap in roadmaps:
                            assigned_roadmap = AssignedRoadmap.objects.create(roadmap_id=roadmap, student=user, coach=coach)
                            user.assigned_roadmaps.add(assigned_roadmap)
                    messages.success(request, 'You are now coaching {}'.format(user.get_full_name()))
                    login(request, coach)
                    return redirect('/')
                domain = user.company.django_frontend_base_url or settings.DJANGO_FRONTEND_BASE_URL
                context = {
                    'email': email,
                    'coach': coach,
                    'user': user,
                    'private_company': private_id,
                    'invite': True,
                    'create_new_account_link': create_new_account_link,
                    'accept_invitation_link':
                        f"{domain}{_get_invite_accept_link(request, email, user, roadmaps, True)}",
                }
                return render(request, 'registration/coach_invite_confirmation.html', context)
            else:
                return redirect(create_new_account_link)
    messages.error(request, 'An error has occurred')
    return redirect('/')


def email_unsubscribe(request, user_id, token, unsubscribe):
    User.update_unsubscribed(user_id, token, unsubscribe=unsubscribe)
    context = {
        'token': token,
        'unsubscribe': unsubscribe,
        'user_id': user_id,
    }
    return render(request, 'dashboard/subscription_status.html', context)


def delete_account(request):
    request.user.delete()
    logout(request)
    return redirect('login', permanent=False)


def deactivate_account(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    user.is_approved = False
    user.save()
    messages.success(request, 'Account successfully deactivated.')
    return redirect('dashboard')


def activate_account(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    user.is_approved = True
    user.save()
    messages.success(request, 'Account successfully activated.')
    return redirect('dashboard')


def home_redirect(request):
    if request.user.is_authenticated:
        return redirect('super_dashboard' if request.user.is_superuser else 'dashboard' if request.user.is_coach() or request.user.is_admin() else 'roadmaps', permanent=False)
    else:
        get_args_str = request.META['QUERY_STRING']
        return HttpResponseRedirect('%s?%s' % ('login', get_args_str))


@csrf_exempt
def email_bounce_report(request):
    message_type = request.META['HTTP_X_AMZ_SNS_MESSAGE_TYPE']
    body = json.loads(request.body)

    if message_type == 'SubscriptionConfirmation':
        url = body['SubscribeURL']
        requests.get(url)
    else:
        message = json.loads(body['Message'])
        from_AWS = message['mail']['sendingAccountId']
        if from_AWS == settings.AWS_ACCOUNT_ID:
            bounced_email = message['bounce']['bouncedRecipients'][0]['emailAddress']
            users = User.objects.filter(email=bounced_email)
            for user in users:
                user.valid_email = False
                user.save()
                logger.debug('Hard bounced email from AWS account, s% marked as invalid email', bounced_email)
        else:
            logger.error('Bounced email verification failed for s%', body)

    return HttpResponse()
