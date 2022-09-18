from rest_framework import permissions

from dashboard.models import Competency


class ApprovedUserPermission(permissions.BasePermission):
    message = 'User has to be approved to have access.'

    def has_permission(self, request, view):
        current_user = request.user
        if current_user.is_superuser or current_user.is_admin():
            return True
        return current_user.is_approved


class AdminCoachOrCohortAdminPermission(permissions.BasePermission):
    message = 'User has to be an admin, a coach or a cohort admin to have access.'

    def has_permission(self, request, view):
        current_user = request.user
        return current_user.is_cohort_admin() or current_user.is_admin() or current_user.is_coach()


class UserCompanyAllowSpecificCoachesForSpecificRoadmapsPermission(permissions.BasePermission):
    message = 'User company should allow assignment of specific coaches for specific roadmaps.'

    def has_permission(self, request, view):
        current_user = request.user
        return current_user.company.users_can_assign_specific_coaches_for_specific_roadmaps


class AdminOrReadOnlyObjectPermission(permissions.BasePermission):
    message = 'User has to be admin to have edit access.'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        current_user = request.user
        if current_user.is_superuser or current_user.is_admin():
            return True

        return False


class AdminOnlyPermission(permissions.BasePermission):
    message = 'User has to be admin to have access.'

    def has_permission(self, request, view):
        current_user = request.user
        return current_user.is_admin()


class CoachOnlyPermission(permissions.BasePermission):
    message = 'User has to be coach to have access.'

    def has_permission(self, request, view):
        current_user = request.user
        return current_user.is_coach()


class UserCompanyHasCompetencyNotesJournalEnabledPermission(permissions.BasePermission):
    message = 'User company should have competency notes journal enabled.'

    def has_permission(self, request, view):
        current_user = request.user
        return current_user.company.competency_notes_journal_section


class UserCompanySameAsObjectCompanyOrReadOnlyPermission(permissions.BasePermission):
    message = 'User has to be belong to the same company as object to have edit access.'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        current_user = request.user
        if current_user.is_superuser:
            return True

        return current_user.company == obj.company


class AdminOrCoachSpecificOrReadOnlyCompetencyPermission(permissions.BasePermission):
    message = 'User has to be admin or a coach for a student specific competency to have edit access.'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        current_user = request.user
        if current_user.is_admin():
            return True

        if current_user.is_coach():
            competency = obj if isinstance(obj, Competency) else obj.competency
            if competency.user_defined and competency.student in current_user.students.all():
                return True

        return False
