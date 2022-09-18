from django import forms
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import Group
from django.core.exceptions import MultipleObjectsReturned
from django.core.files import File
from django.core.files.base import ContentFile
from django.shortcuts import render, redirect, HttpResponseRedirect, get_object_or_404
from django.template.loader import render_to_string
from django.urls import reverse
from django.http import JsonResponse
from django.utils.html import format_html
# from revroad.apis import aws, facebook
from rest_framework.authtoken.models import Token

import random
import requests
import string
import uuid

from dashboard import util
from dashboard.models import User, Company, AssignedCompany, AssignedRoadmap
from .forms import LoginForm2, AddEmailUser


def auth_login2(request):
    if request.user.is_authenticated:
        return redirect('index')
    form = LoginForm2(request.POST or None)
    next_url = request.GET.get('next')
    if request.GET.get('ios_app'):
        request.session['ios_app'] = True
    elif request.GET.get('android_app'):
        request.session['android_app'] = True

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

    if form.is_valid():
        url = None
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        try:
            # private_id is None if not provided via either query param or session (see variable initialization)
            # In case it's None it's not used upon User record lookup (see EmailBackend implementation)
            user = authenticate(request, email=username, password=password, company_id=private_id)
            # If private_id is provided and we didn't find any user let's try once more without it
            # This helps to avoid locking out users when they just logged out from a private labeled company
            if user is None and private_id is not None:
                user = authenticate(request, email=username, password=password)
        except MultipleObjectsReturned:
            user = authenticate(request, email=username, password=password,
                                company_id=User.objects.filter(email=username).first().company.id)
            url = reverse('choose_active_company')
        if user is None:
            form.add_error(None, 'Please enter a valid email and password.')
        else:
            # If user does not have an active company
            if user.company is None:
                message = format_html('<span>This email is not associated with any organizations powered by MyRoadmap. Please contact your administrator to activate your account.</span>')
                form.add_error('username', message)
                context = {
                    'form': form,
                    'settings':settings
                }
                return render(request, "registration/login_form2.html", context)
            if request.GET.get('new_company') and private_id:
                user.pk = None
                user.username = str(uuid.uuid4())
                user.company = private_company
                user.is_approved = False if private_company and private_company.requires_approval else True
                user.save()
                user.groups.set(Group.objects.filter(name='User'))
                user.cohort.clear()
                url = reverse('choose_active_company')
            elif not url:
                url = reverse('index')
                if next_url is not None:
                    url = next_url
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            response = HttpResponseRedirect(url)
            response.set_cookie('authtoken', token, None, None, '/', None, True)
            if not user.company or not user.company.private_labeled:
                request.session['private_company_id'] = ''
            return response
    context = {
        'form': form,
        'settings': settings,
        'private_company': private_company,
    }
    return render(request, "registration/login_form2.html", context)


def welcome(request):
    if request.user.is_authenticated:
        return redirect('index')
    if request.GET.get('ios_app'):
        request.session['ios_app'] = True
    elif request.GET.get('android_app'):
        request.session['android_app'] = True

    private_company = None
    private_id = request.GET.get('private_id') or request.session.get('private_company_id')
    if private_id:
        private_company = Company.objects.filter(id=private_id).first()
        if private_company.id == 1:
            private_company = None
        if private_company:
            request.session['private_company_id'] = private_company.id
    else:
        request.session['private_company_id'] = ''

    context = {
        'settings':settings,
        'private_company': private_company
    }

    if private_id == '87' and not request.GET.get('no_wizard'):
        return render(request, "registration/welcome_wizard.html", context)
    else:
        return render(request, "registration/welcome.html", context)

# def auth_sign_in_facebook(request):
#     response = {'next_page': reverse('index')}
#     token = request.POST.get('token')
#     facebook_user_id = facebook.debug_facebook_access_token(token)
#     private_id = request.session.get('private_company_id')
#     if private_id:
#         private_company = Company.objects.filter(id=private_id).first()

#     if facebook_user_id:
#         user = User.objects.filter(facebook_id=facebook_user_id).first()
#         if not user:
#             user_info = facebook.get_user_info(token, include_friends=True)
#             email = user_info and user_info.get('email')
#             if email:
#                 user = User.objects.filter(email=email).first()
#                 if user:
#                     user.facebook_id = facebook_user_id
#                     if not user.photo:
#                         random_filename = rand_str(5)
#                         image_content = ContentFile(requests.get(user_info.get('picture_url')).content)
#                         user.photo.save(f'{random_filename}.png', image_content)
#                     user.save()
#         if user:
#             login(request, user)
#             response['result'] = 'user_exists'
#             # return HttpResponseRedirect(reverse('index'))
#         elif email:
#             # this is were we create the new user from facebook
#             # sometimes Facebook does not give us email even though we have permission
#             user = User.objects.create_user(
#                 facebook_user_id,
#                 email=email,
#                 first_name=user_info.get('first_name'),
#                 last_name=user_info.get('last_name'),
#                 facebook_id=facebook_user_id,
#                 company_id=private_id or 1,
#                 is_approved=False if private_company and private_company.requires_approval else True,
#                 # banner_picture_url = user_info.get('cover', {}).get('source', '')
#             )
#             random_filename = rand_str(5)
#             image_content = ContentFile(requests.get(user_info.get('picture_url')).content)
#             user.photo.save(f'{random_filename}.png', image_content)
#             login(request, user)
#             response['result'] = 'new_user'
#         else:
#             response['result'] = 'no_email'
#     return JsonResponse(response)


# def auth_sign_in_google(request):
#     response = {'next_page': reverse('index')}
#     token = request.POST.get('token')
#     private_id = request.session.get('private_company_id')
#     if private_id:
#         private_company = Company.objects.filter(id=private_id).first()
#     try:
#         # Specify the CLIENT_ID of the app that accesses the backend:
#         # user_info = google_id_token.verify_oauth2_token(token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
#         # print('**user_info: ', user_info)
#         # Or, if multiple clients access the backend server:
#         user_info = google_id_token.verify_oauth2_token(token, google_requests.Request())
#         if user_info.get('aud') not in settings.GOOGLE_CLIENT_IDS:
#             raise ValueError('Could not verify audience.')

#         if user_info.get('iss') not in ['accounts.google.com', 'https://accounts.google.com']:
#             raise ValueError('Wrong issuer.')
#         # If auth request is from a G Suite domain:
#         # if user_info['hd'] != GSUITE_DOMAIN_NAME:
#         #     raise ValueError('Wrong hosted domain.')
#     except ValueError:
#         # Invalid token
#         pass
#     else:
#         # ID token is valid. Get the user's Google Account ID from the decoded token.
#         google_id = user_info.get('sub')
#         user = User.objects.filter(google_id=google_id).first()
#         email = user_info.get('email')
#         if not user and email:
#             user = User.objects.filter(email=email).first()
#             if user:
#                 user.google_id = google_id
#                 if not user.photo:
#                     random_filename = rand_str(5)
#                     image_content = ContentFile(requests.get(user_info.get('picture')).content)
#                     user.photo.save(f'{random_filename}.png', image_content)
#                 user.save()
#         if user:
#             login(request, user)
#             response['result'] = 'user_exists'
#         elif email:
#             user = User.objects.create_user(
#                 google_id,
#                 email=email,
#                 first_name=user_info.get('given_name'),
#                 last_name= user_info.get('family_name') or "",
#                 google_id=google_id,
#                 company_id=private_id or 1,
#                 is_approved=False if private_company and private_company.requires_approval else True,
#             )
#             random_filename = rand_str(5)
#             image_content = ContentFile(requests.get(user_info.get('picture')).content)
#             user.photo.save(f'{random_filename}.png', image_content)
#             login(request, user)
#             response['result'] = 'new_user'
#         else:
#             response['result'] = 'no_email'
#     return JsonResponse(response)


def email_signup(request):
    args = {}
    form_title = 'Sign up'
    roadmaps = request.GET.getlist('r')
    private_company = None
    private_id = request.GET.get('private_id') or request.session.get('private_company_id')
    try:
        private_id = int(private_id)
        private_company = Company.objects.filter(id=private_id).first()
        private_company_name = Company.objects.filter(id=private_id).first().name
        form_title = private_company_name + ' ' + 'Sign up'
    except:
        private_id = 1
        private_company = None
    if request.method == 'POST':
        form = AddEmailUser(request.POST, company_id=private_id)
        if form.is_valid():
            user = form.save(commit=False)
            #all email signups without a private_id are signed up under company MyRoadmap
            user.company_id = private_id or 1
            user.is_approved = False if private_company and private_company.requires_approval else True
            user.username = str(uuid.uuid4())
            user.set_password(form.cleaned_data['password'])
            user.save()
            if request.session.get('coach_invite') is True:
                user_that_invited = User.objects.filter(id=request.session.get('coach_invite_user_id')).first()
                if user_that_invited:
                    user.company_id = user_that_invited.company_id
                    user.save()
                    user_that_invited.coach.add(user)
                    user.groups.add(Group.objects.get(name='Coach'))
                    messages.success(request, 'You are now coaching {}'.format(user_that_invited.get_full_name()))
                    util.send_coach_accepted_invitation_email(user, user_that_invited)
            user.groups.add(Group.objects.get(name='User'))
            # If the user's company has specific coaches for specific roadmaps turned on, add roadmap assignments
            if user.company.users_can_assign_specific_coaches_for_specific_roadmaps:
                for roadmap in roadmaps:
                    assigned_roadmap = AssignedRoadmap.objects.create(roadmap_id=roadmap, student=user_that_invited, coach=user)
                    user_that_invited.assigned_roadmaps.add(assigned_roadmap)
            login(request, user)
            util.send_email_from_django_frontend(
                'Welcome to {}'.format(user.company.name),
                lambda ctx: 'Welcome to MyRoadmap! Use the following link to log in: {}'.format(ctx['primary_link']),
                user,
                'registration/welcome_html.html',
                primary_link=f"/login/?private_id={user.company.id}",
            )
            return HttpResponseRedirect(request.GET.get('next') or '/')
    else:
        email = request.GET.get('e') if request.GET.get('from_coach_invite') == 'true' else ''
        form = AddEmailUser(company_id=private_id, initial={'email': email})

    request.session['coach_invite'] = False
    if request.GET.get('from_coach_invite') == 'true':
        user_id = request.GET.get('u')
        email = request.GET.get('e')
        token = request.GET.get('t')
        validate_token = util.get_invite_token(user_id, email)
        if user_id and email and token == validate_token:
            user = User.objects.filter(id=user_id).first()
            if user:
                request.session['coach_invite'] = True
                request.session['coach_invite_email'] = email
                request.session['coach_invite_user_id'] = user_id
                form_title = 'Sign up to coach {}{}'.format(
                    user.get_full_name(),
                    '' if user.company_id == 1 else ' at {}'.format(user.company.name),
                )

    context = {
        'private_company': private_company,
        'form': form,
        'form_title': form_title,
        'check_captcha': True,
        'settings': settings,
    }
    return render(request, 'registration/email_signup.html', context=context)


def rand_str(n): return ''.join([random.choice(string.ascii_lowercase) for i in range(n)])
