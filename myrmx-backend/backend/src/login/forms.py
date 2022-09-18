from django import forms

from dashboard.models import User


class LoginForm2(forms.Form):
    username = forms.CharField(
        label='Email',
        widget=forms.TextInput(attrs={
            'autocomplete': 'username-email',
            'autocapitalize': 'none',
            'placeholder': 'Email',
            'type': 'email'}))
    password = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={
            'autocomplete': 'current-password',
            'autocapitalize': 'none',
            'placeholder': 'Password'}))


class AddEmailUser(forms.ModelForm):
    first_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'First Name'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Last Name'}))
    email = forms.CharField(widget=forms.EmailInput(attrs={'placeholder': 'Email'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password'}), label='Password')

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'password',
        ]

    def __init__(self, *args, **kwargs):
        self.company_id = kwargs.pop('company_id')
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.error_messages = {
                'required': '{fieldname} is required'.format(fieldname=field.label),
            }

    def clean(self, *args, **kwargs):
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')
        user = User.objects.filter(email__iexact=email, company_id=self.company_id).distinct()
        if user.exists():
            raise forms.ValidationError('User exists with that email. You can use forgot password to login to that account.', code='DUPLICATE_EMAIL')
        if len(password) < 4:
            raise forms.ValidationError('Please enter a password longer than 6 characters.')
        return super().clean(*args, **kwargs)
