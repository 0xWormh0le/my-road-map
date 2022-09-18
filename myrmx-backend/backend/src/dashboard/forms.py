from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django import forms
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.contrib.admin.widgets import AdminFileWidget
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django.contrib.auth.models import Group
from django.db.models import Q
from django.urls import reverse
from postman.forms import WriteForm
from postman.fields import BasicCommaSeparatedUserField

from .models import Cohort, Company, Competency, Assessment, Roadmap, Stage, User, ActionItemGlobal, Note, Attachment, QuestionGlobal, QuestionAnswer, ContentGlobal, ContentResponse, FollowUpItem, AssignedCompany

class AddNewActionItemForm(forms.Form):
    description = forms.CharField()
    due_date = forms.DateField()
    competency_id = forms.IntegerField(widget=forms.HiddenInput())
    student_id = forms.IntegerField(widget=forms.HiddenInput())

    def __init__(self, *args, **kwargs):
        competency_id = kwargs.pop('competency_id', None)
        student_id = kwargs.pop('student_id', None)
        super().__init__(*args, **kwargs)
        self.fields['competency_id'].initial = competency_id
        self.fields['student_id'].initial = student_id
        self.fields['due_date'].widget.attrs['readonly'] = True

class AddNewFollowUpItemForm(forms.Form):
    due_date = forms.DateField()
    student_id = forms.IntegerField(widget=forms.HiddenInput())

    def __init__(self, *args, **kwargs):
        student_id = kwargs.pop('student_id', None)
        super().__init__(*args, **kwargs)
        self.fields['student_id'].initial = student_id
        self.fields['due_date'].widget.attrs['readonly'] = True


class AddNewQuestionForm(forms.Form):
    question = forms.CharField()
    description = forms.CharField()
    competency_id = forms.IntegerField(widget=forms.HiddenInput())
    student_id = forms.IntegerField(widget=forms.HiddenInput())

    def __init__(self, *args, **kwargs):
        competency_id = kwargs.pop('competency_id', None)
        student_id = kwargs.pop('student_id', None)
        super().__init__(*args, **kwargs)
        self.fields['competency_id'].initial = competency_id
        self.fields['student_id'].initial = student_id


class AddNewContentForm(forms.Form):
    title = forms.CharField()
    description = forms.CharField()
    competency_id = forms.IntegerField(widget=forms.HiddenInput())
    student_id = forms.IntegerField(widget=forms.HiddenInput())

    def __init__(self, *args, **kwargs):
        competency_id = kwargs.pop('competency_id', None)
        student_id = kwargs.pop('student_id', None)
        super().__init__(*args, **kwargs)
        self.fields['competency_id'].initial = competency_id
        self.fields['student_id'].initial = student_id


ai_description_field_help_text = "Attention! Images uploaded in this field aren't completely private."


class AddNewGlobalActionItemForm(forms.ModelForm):
    RESOLUTIONS = (
        ('mark_complete', 'mark complete'),
        ('requires_approval', 'requires approval'),
        ('attach_file', 'attach file'),
        ('attach_screen_recording', 'attach screen recording'),
        ('input_text', 'input text'),
        # ('attach_audio_recording', 'attach audio recording'),
    )
    
    competency_id = forms.IntegerField(widget=forms.HiddenInput())
    aiTitle = forms.CharField()
    aiDescription = forms.CharField(widget=CKEditorUploadingWidget(), required=False,
                                    help_text=ai_description_field_help_text)
    resolutions = forms.MultipleChoiceField(
        choices=RESOLUTIONS,
        label="What do you want the user to do?", 
        required=True,
        widget=forms.CheckboxSelectMultiple)
    # aiAttachment = forms.FileField(required=False)

    class Meta:
        model = ActionItemGlobal
        fields = ('aiTitle','aiDescription','resolutions')

    def __init__(self, *args, **kwargs):
        request = kwargs.pop('request')
        competency_id = kwargs.pop('competency_id', None)
        competency = Competency.objects.filter(id=competency_id)
        super().__init__(*args, **kwargs)
        self.fields['competency_id'].initial = competency_id
        self.fields['resolutions'].initial = ['mark_complete','requires_approval','attach_file','attach_screen_recording','input_text']
        self.fields['aiDescription'].label = "Description"
        self.fields['aiTitle'].label = "Title"
        # self.fields['aiAttachment'].label = "Private file attachment"
        # user_cohorts = [cohort for cohort in request.user.cohort.all()]
        # if user_cohorts:
        #     self.fields['cohort'].queryset = request.user.cohort.all()
        #     self.fields['cohort'].required = True
        #     self.fields['cohort'].initial = user_cohorts[0]
        #     self.fields['cohort'].help_text = ''
        # else:
        #     self.fields['cohort'].queryset = Cohort.objects.filter(company=request.user.company)


class EditNewGlobalActionItemForm(forms.ModelForm):
    RESOLUTIONS = (
        ('mark_complete', 'mark complete'),
        ('requires_approval', 'requires approval'),
        ('attach_file', 'attach file'),
        ('attach_screen_recording', 'attach screen recording'),
        ('input_text', 'input text'),
        # ('attach_audio_recording', 'attach audio recording'),
    )
    
    competency_id = forms.IntegerField(widget=forms.HiddenInput())
    item_id = forms.IntegerField(widget=forms.HiddenInput())
    aiTitle = forms.CharField()
    aiDescription = forms.CharField(widget=CKEditorUploadingWidget(), required=False,
                                    help_text=ai_description_field_help_text)
    resolutions = forms.MultipleChoiceField(
        choices=RESOLUTIONS,
        label="What do you want the user to do?", 
        required=True,
        widget=forms.CheckboxSelectMultiple)
    # aiAttachment = forms.FileField(required=False)

    class Meta:
        model = ActionItemGlobal
        fields = ('aiTitle','aiDescription','resolutions')

    def __init__(self, *args, **kwargs):
        super(EditNewGlobalActionItemForm, self).__init__(*args, **kwargs)
        self.fields['competency_id'].initial = self.instance.competency.id
        self.fields['item_id'].initial = self.instance.id
        self.fields['aiDescription'].label = "Description"
        self.fields['aiTitle'].label = "Title"
        # self.fields['aiAttachment'].label = "Private file attachment"

class AddNewGlobalQuestionForm(forms.ModelForm):
    competency_id = forms.IntegerField(widget=forms.HiddenInput())
    question = forms.CharField()

    class Meta:
        model = QuestionGlobal
        fields = ('question', )

    def __init__(self, *args, **kwargs):
        request = kwargs.pop('request')
        competency_id = kwargs.pop('competency_id', None)
        competency = Competency.objects.filter(id=competency_id)
        super().__init__(*args, **kwargs)
        self.fields['competency_id'].initial = competency_id


class AddNewGlobalContentForm(forms.ModelForm):
    competency_id = forms.IntegerField(widget=forms.HiddenInput())
    title = forms.CharField()

    class Meta:
        model = ContentGlobal
        fields = ('title', )

    def __init__(self, *args, **kwargs):
        request = kwargs.pop('request')
        competency_id = kwargs.pop('competency_id', None)
        competency = Competency.objects.filter(id=competency_id)
        super().__init__(*args, **kwargs)
        self.fields['competency_id'].initial = competency_id




class EditCompetencyNotes(forms.ModelForm):
    text = forms.CharField(widget=forms.Textarea(attrs={'placeholder':'Add your thoughts...'}), required=False)

    class Meta:
        model = Note
        fields = ['text']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class AddEditCohortForm(forms.ModelForm):
    class Meta:
        model = Cohort
        fields = ('name', 'description', 'signup_url')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.error_messages = {
                'required': '{fieldname} is required'.format(fieldname=field.label),
            }


class AddAttachmentForm(forms.ModelForm):
    class Meta:
        model = Attachment
        fields = ('attachment',)
        labels = {
            'attachment': ''
        }
        widgets = {
            'attachment': forms.FileInput(attrs={'style':'display:none;'})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.error_messages = {
                'required': '{fieldname} is required'.format(fieldname=field.label),
                'empty': 'The submitted file is empty.',
            }


class EditRoadmapForm(forms.ModelForm):
    class Meta:
        model = Roadmap
        fields = [
        'title',
        'description',
        'is_published',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.error_messages = {
                'required': '{fieldname} is required'.format(fieldname=field.label),
            }


class AddEditCompetencyForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget(), required=False)
    description = forms.CharField(widget=CKEditorUploadingWidget(), required=False)
    coach_notes = forms.CharField(widget=forms.Textarea(attrs={'rows': '3', 'placeholder':'Enter notes for the coach', 'maxlength': 2048}), required=False)
    red_description = forms.CharField(widget=forms.Textarea(attrs={'cols': '', 'rows': '', 'placeholder':'Enter text for a red assessment', 'maxlength': 255}), required=False)
    yellow_description = forms.CharField(widget=forms.Textarea(attrs={'cols': '', 'rows': '', 'placeholder':'Enter text for a yellow assessment', 'maxlength': 255}), required=False)
    green_description = forms.CharField(widget=forms.Textarea(attrs={'cols': '', 'rows': '', 'placeholder':'Enter text for a green assessment', 'maxlength': 255}), required=False)
    daily_assessment = forms.BooleanField(initial=False, label='Send daily assessments', required=False)

    class Meta:
        model = Competency
        fields = [
            'title',
            'description',
            'coach_notes',
            'red_description',
            'yellow_description',
            'green_description',
            'content',
            'daily_assessment',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.error_messages = {
                'required': '{fieldname} is required'.format(fieldname=field.label),
            }


class AddEditUserSpecificObjective(forms.ModelForm):
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': '3', 'placeholder':'Enter text for an objective description', 'maxlength': 2048}), required=False)
    red_description = forms.CharField(widget=forms.Textarea(attrs={'cols': '', 'rows': '', 'placeholder':'Enter text for a red assessment', 'maxlength': 255}), required=False)
    yellow_description = forms.CharField(widget=forms.Textarea(attrs={'cols': '', 'rows': '', 'placeholder':'Enter text for a yellow assessment', 'maxlength': 255}), required=False)
    green_description = forms.CharField(widget=forms.Textarea(attrs={'cols': '', 'rows': '', 'placeholder':'Enter text for a green assessment', 'maxlength': 255}), required=False)
    user_defined = forms.BooleanField(widget=forms.HiddenInput())


    class Meta:
        model = Competency
        fields = [
            'title',
            'description',
            'red_description',
            'yellow_description',
            'green_description',
            'content',
            'user_defined',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.error_messages = {
                'required': '{fieldname} is required'.format(fieldname=field.label),
            }
        self.fields['user_defined'].initial = True


class ChangePasswordForm(forms.Form):
    old_password=forms.CharField(widget=forms.PasswordInput(), required=True, label='Old Password')
    new_password=forms.CharField(widget=forms.PasswordInput(), required=True, label='New Password')
    reenter_password=forms.CharField(widget=forms.PasswordInput(), required=True, label='New Password Confirmation')

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(ChangePasswordForm, self).__init__(*args, **kwargs)
        for field in self.fields.values():
            field.error_messages = {
                'required': '{fieldname} is required'.format(fieldname=field.label),
            }
        self.fields['old_password'].widget.attrs['placeholder'] = "Old Password"
        self.fields['new_password'].widget.attrs['placeholder'] = "New Password"
        self.fields['reenter_password'].widget.attrs['placeholder'] = "New Password Confirmation"

    def clean(self):
        old_password=self.cleaned_data.get('old_password')
        new_password=self.cleaned_data.get('new_password')
        reenter_password=self.cleaned_data.get('reenter_password')
        if new_password and new_password!=reenter_password:
            self.add_error('reenter_password', forms.ValidationError("Passwords do not match"))
        if not self.user.check_password(old_password):
            self.add_error('old_password', forms.ValidationError("Old password incorrect"))
        if new_password==old_password:
            self.add_error('new_password', forms.ValidationError("New password cannot match old password"))
        try:
            validate_password(new_password, self.user)
        except forms.ValidationError as error:
            # Method inherited from BaseForm
            self.add_error('new_password', error)
        return self.cleaned_data #don't forget this.


class AssessCompetencyForm(forms.Form):
    status = forms.TypedChoiceField(coerce=int, choices=Assessment.STATUS_CHOICES)


class CompanyAwarePasswordResetForm(PasswordResetForm):
    def send_mail(self, subject_template_name, email_template_name,
                  context, from_email, to_email, html_email_template_name=None):
        request = context['request']
        try:
            company = Company.objects.get(django_frontend_base_url__icontains=request.META['HTTP_HOST'])
        except Company.DoesNotExist:
            company = None
        user = context['user']
        if not company:
            company = user.company
        domain = company.django_frontend_base_url or settings.DJANGO_FRONTEND_BASE_URL
        unsubscribe_url = reverse('email_unsubscribe', kwargs={
            'user_id': user.id,
            'token': User.get_unsubscribe_token(user.id)
        })
        reset_url = reverse('password_reset_confirm', kwargs={
            'uidb64': context['uid'],
            'token': context['token'],
        })
        context.update({
            'unsubscribe_url': f"{domain}{unsubscribe_url}",
            'primary_link': f"{domain}{reset_url}",
        })
        effective_from_email = from_email
        if company.from_email:
            effective_from_email = f"{company.name} <{company.from_email}>"
        super().send_mail(subject_template_name, email_template_name,
                          context, effective_from_email, to_email, html_email_template_name)


class DashboardPasswordResetForm(CompanyAwarePasswordResetForm):
    def get_users(self, email):
        # There could be multiple user records for the same email
        # There's no need to email the same box multiple times
        return [User.objects.filter(email=email).first()]


class CustomPasswordResetForm(CompanyAwarePasswordResetForm):
    def __init__(self, *args, **kwargs):
        super(CustomPasswordResetForm, self).__init__(*args, **kwargs)
        self.fields['email'].widget.attrs['placeholder'] = "Email"


class CustomPasswordResetConfirmForm(SetPasswordForm):
    def __init__(self, *args, **kwargs):
        super(CustomPasswordResetConfirmForm, self).__init__(*args, **kwargs)
        self.fields['new_password1'].widget.attrs['placeholder'] = "New password"
        self.fields['new_password2'].widget.attrs['placeholder'] = "New password confirmation"


class MessageWriteForm(WriteForm):
    recipients = BasicCommaSeparatedUserField(label='Recipient')

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        if user.is_coach():
            # Add all users that have a company assignment that matches the current user
            # and have the current user as their coach
            send_options = User.objects.filter(coach=user, company=user.company)
        else:
            send_options = user.coach.filter(company=user.company)
        helper2 = send_options.values_list(
            'username', 'first_name', 'last_name').order_by('first_name').distinct()
        helper = [(x[0], x[1] + ' ' + x[2]) for x in helper2 if x[1] != '' and x[2] != '']
        super().__init__(*args, **kwargs)
        self.fields['recipients'].widget = forms.Select(choices=helper)


class StaffCompanyForm(forms.ModelForm):
    # logo = forms.FileField(widget=AdminFileWidget, required=False)
    class Meta:
        model = Company
        fields = [
            'name',
            'logo',
            'private_labeled',
            'requires_approval',
            'users_can_attach_files'
        ]
        help_texts = {
            "requires_approval": "Requires approval of each user who joins this company.",
        }


class StaffQuickAddUser(forms.ModelForm):
    default_cohort = forms.IntegerField(widget=forms.HiddenInput(), required=False)

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'roadmaps',
            'coach',
        ]

    def __init__(self, *args, **kwargs):
        request = kwargs.pop('request')
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs['style'] = 'max-width: 300px;'
            field.error_messages = {
                'required': '{fieldname} is required'.format(fieldname=field.label),
            }

        user_cohort = request.user.cohort.first()
        # This doesn't work if there are multiple cohorts
        if user_cohort:
            # self.fields['cohort'].queryset = request.user.cohort.all()
            self.fields['default_cohort'].initial = user_cohort.id

        ###method = forms.ChoiceField(choices=registry.get_method_choices(), disabled=True, widget=forms.HiddenInput())

        roadmaps = Roadmap.objects.filter(company=request.user.company).all()
        self.fields['roadmaps'].queryset = roadmaps
        self.fields['roadmaps'].initial = roadmaps[0] if len(roadmaps) == 1 else None

        coaches = User.objects.filter(groups__name="Coach", company=request.user.company).distinct()
        self.fields['coach'].queryset = coaches
        self.fields['coach'].initial = coaches[0] if len(coaches) == 1 else None

        self.fields['email'].help_text = 'User will receive a welcome email to set a password'


class StaffUserForm(forms.ModelForm):
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=False)

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'photo',
            'company',
            'groups',
            'cohort',
            'roadmaps',
            # 'mentors',
            'coach',
            'bio',
            #'coach_notes_regarding_student',
            # 'notes_for_coach',
            'is_approved',
        ]
        labels = {
            'coach_notes_regarding_student': 'Notes About User (Hidden from User)',
            'cohort': 'Group',
            'roadmap': 'Roadmap',
            'groups': 'Roles',
        }


        help_texts = {
            'roadmaps': "Hold down the command (Mac) or alt (PC) key to select multiple options",
            'coach': "Hold down the command (Mac) or alt (PC) key to select multiple options",
            'groups': None,
            'cohort': "Hold down the command (Mac) or alt (PC) key to select multiple options",

        }

    def __init__(self, *args, **kwargs):
        request = kwargs.pop('request')
        user = kwargs.get('instance')
        coach_synonym = request.user.company.coach_synonym
        super().__init__(*args, **kwargs)
        self.company_id = request.user.company.id
        self.fields['groups'].required = True
        self.fields['email'].required = False
        self.fields['roadmaps'].initial = Roadmap.objects.filter(assign_to_all_users=True,company=request.user.company)
        if user:
            self.initial['groups'] = list(user.groups.all())

        if request.user.company.coach_synonym:
            self.fields['coach'].label = coach_synonym
            group_names = Group.objects.all()
            x = str(group_names)
        for field in self.fields.values():
            field.widget.attrs['style'] = 'max-width: 400px;'
            field.error_messages = {
                'required': '{fieldname} is required'.format(fieldname=field.label),
            }
        if request.user.is_superuser:
            self.fields['company'].required = True
        else:
            del self.fields['company']
            self.fields['roadmaps'].queryset = Roadmap.objects.filter(company=request.user.company)
            user_cohorts = [cohort for cohort in request.user.cohort.all()]
            if user_cohorts:
                if user:
                    self.fields['coach'].queryset = User.objects.filter(groups__name='Coach', cohort__in=user_cohorts).exclude(pk=user.id).distinct()
                else:
                    self.fields['coach'].queryset = User.objects.filter(groups__name='Coach', cohort__in=user_cohorts).distinct()
                self.fields['cohort'].queryset = request.user.cohort.all()
                self.fields['cohort'].required = True
                self.fields['cohort'].initial = user_cohorts[0]
            else:
                if user:
                    self.fields['coach'].queryset = User.objects.filter(groups__name="Coach", company=request.user.company).exclude(pk=user.id).distinct()
                else:
                    self.fields['coach'].queryset = User.objects.filter(groups__name="Coach", company=request.user.company).distinct()
                self.fields['cohort'].queryset = Cohort.objects.filter(company=request.user.company)
            self.fields['groups'].initial = Group.objects.filter(name="User")[0]

        if not kwargs.get('instance'):
            del self.fields['is_approved']
            self.fields['email'].help_text = 'If email address is provided, User will receive a welcome email to set a password'
            # self.fields['send_welcome_email'] = forms.BooleanField(initial=True, label='send welcome email to set password')
            # order = list(self._meta.fields)
            # order.insert(self._meta.fields.index('email') + 1, 'send_welcome_email')
            # self.order_fields(order)
        # self.fields['coach_notes_regarding_student'].widget.attrs['style'] = 'width:100%; height:100px;'

    def clean(self):
        email = self.cleaned_data.get('email')
        if email:
            user_qs = User.objects.filter(email__iexact=email, company_id=self.company_id)
            if self.instance.pk:
                user_qs = user_qs.exclude(pk=self.instance.pk)
            if user_qs.distinct().exists():
                raise forms.ValidationError({'email': ['User exists with that email.']})
        return super().clean()


class CoachUserForm(forms.ModelForm):

    class Meta:
        model = User
        fields = [
            'roadmaps',
        ]

    def __init__(self, *args, **kwargs):
        request = kwargs.pop('request')
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs['style'] = 'max-width: 500px;'
        self.fields['roadmaps'].queryset = Roadmap.objects.filter(company=request.user.company)


class CoachForm2(forms.ModelForm):

    class Meta:
        model = User
        fields = [
            'coach',
        ]

    def __init__(self, *args, **kwargs):
        request = kwargs.pop('request')
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        coach_synonym = request.user.company.coach_synonym
        if request.user.company.coach_synonym:
            self.fields['coach'].label =  coach_synonym
        for field in self.fields.values():
            field.widget.attrs['style'] = 'max-width: 500px;'
            if request.user.company.users_can_assign_specific_coaches_for_specific_roadmaps:
                self.fields['coach'].queryset = User.objects.filter(groups__name="Coach", company=request.user.company, students=request.user).distinct()
            else:
                self.fields['coach'].queryset = User.objects.filter(groups__name="Coach", company=request.user.company).distinct()


class ProfileForm(forms.ModelForm):
    # the autocomplete attr makes it so chrome doesn't autocomplete the password field
    # password = forms.CharField(widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}), required=False, initial='')

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'bio',
            'roadmaps',
            'coach',
            'unsubscribed',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.fields['password'].label =  'Change Password'
        del self.fields['roadmaps']
        del self.fields['coach']


    def save(self):
        o = super().save(commit=False)
        # if self.cleaned_data.get('password'):
        #     o.set_password(self.cleaned_data['password'])
        # elif o.pk:
        #     o.password = User.objects.get(pk=o.pk).password
        o.save()
        self.save_m2m()
        return o
