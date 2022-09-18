from django import forms

from dashboard.models import User

class UserForm(forms.ModelForm):
    first_name = forms.CharField(widget=forms.TextInput({'placeholder': 'First Name'}), required=True)
    last_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Last Name'}), required=True)
    email = forms.CharField(widget=forms.EmailInput(attrs={'placeholder': 'Email'}), required=True)
    password = forms.CharField(widget=forms.PasswordInput(attrs={'autocomplete': 'new-password', 'placeholder': 'Password'}), required=True, initial='')

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']

    def save(self, commit=True):
        user = super(UserForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.error_messages = {
                'required': '{fieldname} is required'.format(fieldname=field.label),
            }
