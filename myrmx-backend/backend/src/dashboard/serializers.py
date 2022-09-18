from rest_framework.serializers import ModelSerializer
from rest_framework import permissions, status

from .models import Assessment

class AssessmentSerializer(ModelSerializer):
    class Meta:
        model = Assessment
        fields = (
            'id', 'competency', 'date', 'student', 'user', 'status'
        )

class IsOwner(permissions.BasePermission):
	def has_object_permission(self, request, view, obj):
		# must be the owner to view the object
		return obj.user == request.user

class AuthorizedMixin(object):
	permission_classes = (permissions.IsAuthenticated, IsOwner)

	def get_queryset(self):
		# filter all devices to only those belonging to the current user
		return self.queryset.filter(user=self.request.user)