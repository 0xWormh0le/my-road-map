import uuid

from boolean_switch.admin import AdminBooleanMixin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.admin import DateFieldListFilter
from django.utils.html import format_html

from dashboard.models import (
    User, Stage, Competency, Assessment, ActionItemAssessment, ActionItemGlobal, Cohort, Roadmap, Company,
    RoadmapAssignment, QuestionGlobal, QuestionAnswer, ContentGlobal, ContentResponse, FollowUpItem, AssignedRoadmap,
)


class CompetencyAdmin(AdminBooleanMixin, admin.ModelAdmin):
    list_display = ('stage_and_title', 'student_name', 'student', 'created', 'updated')
    ordering = ('student', 'stage', 'order')

    search_fields = ('student__first_name', 'student__last_name', 'student__username', 'stage__title', 'title')

    def stage_and_title(self, obj):
        return str(obj)

    def student_name(self, obj):
        if obj.student is not None:
            return str(obj.student)
        return None


class StageAdmin(admin.ModelAdmin):
    ordering = ('roadmap', 'title', )
    list_display = ('roadmap_and_stage',)

    def roadmap_and_stage(self, obj):
        return str(obj)


class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'competency', 'stage', 'status')

    def name(self, obj):
        return obj.student

    name.short_description = 'User'

    def stage(self, obj):
        return obj.competency.stage


class UserAdmin(AdminBooleanMixin, BaseUserAdmin):
    # exclude = ['username', 'sidebar_list', 'last_seen']
    # filter_horizontal = ('mentors',)
    list_display = ('username', 'name', 'company', 'company_list', 'email', 'group_member', 'approved', 'cohorts')
    list_filter = ('groups', ('date_joined', DateFieldListFilter))
    search_fields = ('first_name', 'last_name', 'username')

    fieldsets = (
        ('', {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'bio', 'photo', 'company')}),
        ('Roadmap Info', {'fields': ('roadmaps', 'archived_roadmaps', 'coach', 'cohort')}),
        ('Permissions', {'fields': ('is_approved', 'is_active', 'is_staff', 'is_superuser', 'unsubscribed', 'valid_email', 'groups')}),
    )
    # fieldsets = (
    #     ('Standard info', {
    #         'fields': ('username', 'email', 'password', 'is_active', 'is_staff', 'is_superuser', 'groups',)
    #     }),
    # )

    def group_member(self, obj):
        l = []
        for g in obj.groups.all():
            l.append(g.name)
        return l

    group_member.short_description = 'Group member'

    def name(self, obj):
        return obj

    name.short_description = 'Name'

    def roadmaps_display(self, obj):
        return list(obj.roadmaps.all())

    roadmaps_display.short_description = 'Roadmaps'

    def cohorts(self, obj):
        return list(obj.cohort.all())

    def company_list(self, obj):
        return list(obj.companies)

    company_list.short_description = 'Companies'

    def approved(self, obj):
        url = '/admin/dashboard/user/{}/is_approved/switch/'.format(obj.id)
        return format_html('<a href ="%s" class="boolean_switch"><img src="/static/admin/img/icon-%s.svg" alt="%d" /></a>'
                           % (url, ('no', 'yes')[obj.is_approved], obj.is_approved)
                           )

    approved.short_description = 'Approved'

    def get_changeform_initial_data(self, request):
        return {'username': str(uuid.uuid4())}

    # TODO: Restore bulk removal when it will be workable again
    # While User model has custom delete() method to handle DB remnants (namely assigned_companies & companies fields)
    # bulk removal, i.e. QuerySet.delete(), won't work properly hence we disabled it
    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


class ActionItemGlobalAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'competency', 'due_date', 'cohorts')
    ordering = ('due_date', )

    def cohorts(self, obj):
        return list(obj.cohort.all())

    def description(self, obj):
        return obj.aiDescription
    
    def title(self, obj):
        return obj.aiTitle


class QuestionGlobalAdmin(admin.ModelAdmin):
    ordering = ('question', )


class QuestionAnswerAdmin(admin.ModelAdmin):
    ordering = ('answer', )


class ContentGlobalAdmin(admin.ModelAdmin):
    ordering = ('title', )


class ContentResponseAdmin(admin.ModelAdmin):
    ordering = ('response', )


class RoadmapAdmin(admin.ModelAdmin):
    ordering = ('title', )


class RoadmapAssignmentAdmin(admin.ModelAdmin):
    ordering = ('user', )


class AssignedRoadmapsAdmin(admin.ModelAdmin):
    ordering = ('roadmap', )
    list_display = ('roadmap', 'student', 'coach')


class FollowUpItemAdmin(admin.ModelAdmin):
    ordering = ('student', )
    list_display = ('student', 'due_date', 'marked_done', 'date_marked_done')


class ActionItemAssessmentAdmin(AdminBooleanMixin, admin.ModelAdmin):
    list_display = ('desc', 'name', 'marked_done', 'date_marked_done', 'approved_done', 'date_approved_done', 'archived')

    def desc(self, obj):
        if obj.parent is None:
            return obj.description
        return obj.parent.aiTitle

    desc.short_description = 'Action Item'

    def name(self, obj):
        return obj.student.first_name + " " + obj.student.last_name

    name.short_description = 'User'


class CompanyAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {
            'fields': (
                'name', 'logo', 'private_labeled', 'requires_approval', 'terms_and_conditions',
                'privacy_policy', 'email_welcome_message', 'app_welcome_message', 'default_theme',
            )
        }),
        ('Features', {
            'classes': ('collapse',),
            'fields': (
                'user_can_asssign_roadmaps', 'coach_can_asssign_roadmaps', 'group_specific_roadmaps',
                'users_can_attach_files', 'coach_notes', 'competency_notes_journal_section', 'conversations',
                'users_can_assign_specific_coaches_for_specific_roadmaps', 'follow_up_schedule',
                'users_can_assign_coach', 'users_can_erase_their_account', 'archive_roadmaps',
                'coach_admin_assign_user_specifc_objectives', 'coach_admin_edit_visibility_user_objectives',
                'hide_roadmaps_from_users', 'pin_roadmaps_for_users', 'assign_roadmaps_to_all_users',
                'users_can_add_action_items', 'coaches_admin_can_assess_objectives',
                'show_print_competency_detail_button', 'coaches_approve_green_assessments', 'users_can_invite_coach',
                'slider_for_competency_assessment',
            ),
        }),
        ('Synonyms', {
            'classes': ('collapse',),
            'fields': ('coach_synonym', 'user_synonym', 'assessment_synonym'),
        }),
        ('Assessments', {
            'classes': ('collapse',),
            'fields': (
                'default_red_assessment', 'default_yellow_assessment', 'default_green_assessment',
                'default_red_assessment_prompt', 'default_yellow_assessment_prompt', 'default_green_assessment_prompt',
            ),
        }),
        ('Emails', {
            'classes': ('collapse',),
            'fields': (
                'from_email', 'legal_address', 'django_frontend_base_url', 'react_frontend_base_url',
            ),
        }),
    )


admin.site.register(User, UserAdmin)
admin.site.register(Stage, StageAdmin)
admin.site.register(Competency, CompetencyAdmin)
admin.site.register(Assessment, AssessmentAdmin)
admin.site.register(ActionItemGlobal, ActionItemGlobalAdmin)
admin.site.register(ActionItemAssessment, ActionItemAssessmentAdmin)
admin.site.register(QuestionGlobal, QuestionGlobalAdmin)
admin.site.register(QuestionAnswer, QuestionAnswerAdmin)
admin.site.register(ContentGlobal, ContentGlobalAdmin)
admin.site.register(ContentResponse, ContentResponseAdmin)
admin.site.register(FollowUpItem, FollowUpItemAdmin)
admin.site.register(Cohort)
admin.site.register(RoadmapAssignment, RoadmapAssignmentAdmin)
admin.site.register(Roadmap, RoadmapAdmin)
admin.site.register(AssignedRoadmap, AssignedRoadmapsAdmin)
admin.site.register(Company, CompanyAdmin)
