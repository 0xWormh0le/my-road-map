import uuid

from django.conf import settings
from django.contrib.auth import login as django_login
from django.contrib.auth.models import Group
from rest_auth.app_settings import create_token, TokenSerializer
from rest_auth.models import TokenModel
from rest_auth.views import LoginView, LogoutView
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.settings import api_settings

from api.serializers import SignUpUserSerializer
from api.shared import send_email_from_react_frontend
from dashboard.models import User, Company


class LoginWithoutAuthView(LoginView):
    """
    This is log in API endpoint.

    It checks credentials and returns the access token ('key' field) if the credentials are valid and authenticated.
    Can also optionally authenticate user via Django session framework what is enabled by default.
    """
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def get_view_name(self):
        return 'Login'


class LogoutWithAuthView(LogoutView):
    """
    This is log out API endpoint.

    Deletes the Token object assigned to the current user.
    If authentication via sessions is enabled also drops current session.
    Accepts/returns nothing.
    """
    permission_classes = (IsAuthenticated,)

    def get_view_name(self):
        return 'Logout'


class SignUpAPIView(generics.GenericAPIView):
    serializer_class = SignUpUserSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        user_serializer = self.get_serializer(data=self.request.data, context={'request': request})
        user_serializer.is_valid(raise_exception=True)
        private_company = None
        if 'company_name' in user_serializer.data:
            try:
                private_company = Company.objects.get(name=user_serializer.data['company_name'])
            except Company.DoesNotExist:
                pass

        new_user_email = user_serializer.data['email']
        new_user_company = private_company if private_company else Company.objects.get(name='MyRoadmap')
        if User.objects.filter(email__iexact=new_user_email, company=new_user_company).exists():
            raise ValidationError({
                api_settings.NON_FIELD_ERRORS_KEY:
                    'User exists with that email. You can use forgot password to login to that account.'
            })

        new_user = User.objects.create(
            username=str(uuid.uuid4()), first_name=user_serializer.data['first_name'],
            last_name=user_serializer.data['last_name'], email=new_user_email, company=new_user_company,
            is_approved=False if private_company and private_company.requires_approval else True)
        new_user.set_password(user_serializer.data['password'])
        new_user.save()

        is_coach = user_serializer.data['is_coach']
        new_user.groups.add(Group.objects.get(name='Coach' if is_coach else 'User'))
        user_token = create_token(TokenModel, new_user, user_serializer)

        if getattr(settings, 'REST_SESSION_LOGIN', True):
            django_login(request, new_user)

        send_email_from_react_frontend(
            'Welcome to {}'.format(new_user.company.name),
            lambda ctx: 'Welcome to MyRoadmap! Use the following link to log in: {}'.format(ctx['primary_link']),
            new_user,
            'registration/welcome_html.html',
            primary_link="/log-in",
        )

        response_serializer_class = TokenSerializer
        response_serializer = response_serializer_class(instance=user_token, context={'request': self.request})
        return Response(response_serializer.data, status=status.HTTP_200_OK)
