from django.core.exceptions import MultipleObjectsReturned
from django.utils.translation import ugettext_lazy as _
from rest_auth.models import TokenModel
from rest_auth.serializers import PasswordResetSerializer, LoginSerializer
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from api.forms import CompanyAwarePasswordResetForm
from dashboard.models import User


class SignUpUserSerializer(serializers.ModelSerializer):
    school = serializers.CharField(allow_blank=True, required=False)
    company_name = serializers.CharField(allow_blank=True, required=False)
    is_coach = serializers.BooleanField(default=False, required=False)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'school', 'company_name', 'is_coach')
        extra_kwargs = {
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
            'password': {'min_length': 8},
        }


class CustomPasswordResetSerializer(PasswordResetSerializer):
    password_reset_form_class = CompanyAwarePasswordResetForm

    def get_email_options(self):
        request = self.context.get('request')
        return {
            'email_template_name': 'registration/password_reset_email_text.html',
            'html_email_template_name': 'registration/password_reset_email_html.html',
            'extra_email_context': {'request': request},
        }


class LogInResponseSerializer(serializers.ModelSerializer):
    user_is_approved = serializers.ReadOnlyField(source='user.is_approved')

    class Meta:
        model = TokenModel
        fields = ('key', 'user_is_approved')


class LogInRequestSerializer(LoginSerializer):
    company_name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        username = attrs.get('username')
        email = attrs.get('email')
        password = attrs.get('password')
        company_name = attrs.get('company_name')

        user = None

        if username:
            # Username-based lookup isn't ambiguous but it's usage is limited
            user = self._validate_username(username, password)
        elif email:
            lookups = {'email__iexact': email}
            if company_name:
                lookups['company__name'] = company_name
            try:
                user = User.objects.get(**lookups)
            except User.DoesNotExist:
                pass
            except MultipleObjectsReturned:
                lookups['is_active'] = True
                user = User.objects.filter(**lookups).order_by('-last_login').first()
            # We bypass standard auth backends here hence have to check password ourselves
            if user and not user.check_password(password):
                user = None

        # Did we get back an active user?
        if user:
            if not user.is_active:
                raise ValidationError(_('User account is disabled.'))
            if user.is_superuser:
                raise ValidationError(_('Super user access is disabled.'))
        else:
            raise ValidationError(_('Unable to log in with provided credentials.'))

        attrs['user'] = user
        return attrs
