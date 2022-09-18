import uuid

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import Group
from django.shortcuts import render, redirect
from django.views.generic import View

from dashboard.models import Cohort, User, Roadmap
from dashboard.util import send_email_from_django_frontend
from dashboard.views import send_new_assigned_user_email
from signup.forms import UserForm


class UserFormView(View):
    form_class = UserForm
    template_name = 'signup/registration_form.html'

    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {'form': None})

    def post(self, request):
        form = self.form_class(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user.set_password(password)
            user.save()
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('profile')
        return render(request, self.template_name, {'form': None})


class CohortSignupView(View):
    form_class = UserForm
    template_name = 'signup/cohort_registration.html'

    def get(self, request, signup_url):
        get_cohort = Cohort.objects.filter(signup_url=signup_url)
        if not get_cohort:
            return redirect('signup:index')
        cohort = get_cohort[0]
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form, 'cohort': cohort, 'check_captcha': True})

    def post(self, request, signup_url):
        form = self.form_class(request.POST)
        # grecaptcha_response = request.POST.get('g-recaptcha-response')
        # url = 'https://www.google.com/recaptcha/api/siteverify'
        # values = {
        #     'secret': settings.RECAPTCHA_SECRET_KEY,
        #     'response': grecaptcha_response
        # }
        # result = requests.post(url, data=values).json()

        # if result['success']:
        if form.is_valid():
            cohort = Cohort.objects.filter(signup_url=signup_url)[0]
            user = form.save(commit=False)
            password = form.cleaned_data['password']
            user.username = str(uuid.uuid4())
            if not cohort.company.requires_approval:
                user.is_approved = True
            user.company_id = cohort.company.id
            user.save()
            # auto assign roadmap if there is only one at the company
            roadmaps = Roadmap.objects.filter(company=cohort.company)
            if roadmaps.count() == 1:
                user.roadmaps.add(roadmaps[0])
            # auto assign coach if there is one in user's cohort or none in cohort and one global
            coaches = User.objects.filter(groups__name='Coach', cohort=cohort).distinct()
            if coaches.count() == 1:
                user.coach.set(coaches)
            elif coaches.count() == 0:
                coaches = User.objects.filter(groups__name='Coach', company=cohort.company, cohort=None).distinct()
                if coaches.count() == 1:
                    user.coach.set(coaches)
            send_new_assigned_user_email(request, user, user.coach.all())
            user.groups.add(Group.objects.get(name='User'))
            user.cohort.add(cohort)

            user = authenticate(username=user.username, password=password)

            if user is not None:
                send_email_from_django_frontend(
                    f'{user.company}: Verify your account',
                    lambda ctx:
                        'Welcome to MyRoadmap! Use the following link to log in: {}'.format(ctx['primary_link']),
                    user,
                    'registration/welcome_html.html',
                    primary_link=f"/login/?private_id={user.company.id}",
                )
                login(request, user)
                return redirect('index')
        return render(request, self.template_name, {'form': form})
