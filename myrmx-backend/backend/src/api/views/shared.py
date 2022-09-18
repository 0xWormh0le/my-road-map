from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from urllib.parse import urlparse

from api.serializers import DefaultAttachmentSerializer, CreateAttachmentSerializer, UpdateAttachmentSerializer
from api.shared import current_user_role_is_overriden, get_effective_current_user_role_object
from dashboard.models import Roadmap, User, Attachment
from dashboard.views import notify_about_student_activity
from notifications.models import Notification
from notifications.signals import notify


class AttachmentsManagementViewSetMixin:
    @action(detail=True, methods=['post'], url_path='add-attachment', serializer_class=CreateAttachmentSerializer)
    def add_attachment(self, request, **kwargs):
        if 'external_url' in request.data:
            external_url = request.data['external_url']
            if not external_url:
                raise ValidationError({'external_url': 'This field may not be blank'})
            file_name = urlparse(external_url)[2].rpartition('/')[2]
            if not file_name:
                raise ValidationError({'external_url': 'Enter a valid URL'})
            attachment = Attachment(
                filename=file_name, external_url=external_url, file_category=Attachment.ATTACHMENT_FILE_CATEGORY,
                **self.get_serializer_save_kwargs())
            try:
                attachment.full_clean()
            except DjangoValidationError as e:
                if len(e.error_dict) == 1 and 'external_url' in e.error_dict:
                    raise ValidationError({'external_url': 'Enter a valid URL'})
                else:
                    raise
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            attachment = serializer.save(**self.get_serializer_save_kwargs())
            file_name = request.data['attachment'].name
        attachment.init_file_name_and_type(file_name)
        attachment.save()
        self.on_attachment_created(attachment)
        return Response(DefaultAttachmentSerializer(attachment).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='remove-attachment/(?P<attachment_id>[^/.]+)')
    def remove_attachment(self, request, **kwargs):
        current_user = request.user
        attachment = get_object_or_404(Attachment, pk=kwargs['attachment_id'])
        if not current_user.is_superuser and not current_user.is_admin() and attachment.attacher != current_user:
            raise PermissionDenied(f"This attachment doesn't belong to the current user")
        attachment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'], url_path='update-attachment/(?P<attachment_id>[^/.]+)',
            serializer_class=UpdateAttachmentSerializer)
    def update_attachment(self, request, **kwargs):
        current_user = request.user
        attachment = get_object_or_404(Attachment, pk=kwargs['attachment_id'])
        if not current_user.is_superuser and not current_user.is_admin() and attachment.user != current_user:
            raise PermissionDenied(f"This attachment doesn't belong to the current user")
        serializer = self.get_serializer(attachment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        attachment = serializer.save()
        return Response(DefaultAttachmentSerializer(attachment).data)

    def get_serializer_save_kwargs(self):
        current_user = self.request.user
        result = {
            'attacher': current_user,
            'date_attached': timezone.now(),
        }
        attachment_user = self.request.data['user'] if 'user' in self.request.data else None
        if not attachment_user:
            self.on_missing_attachment_user(result)
        return result

    def on_attachment_created(self, attachment):
        if attachment.user is None:
            return
        current_user = self.request.user
        competency = attachment.competency
        student = attachment.user
        if current_user != student:
            notify.send(current_user, recipient=student, verb=Notification.NEW_FILE_ATTACHED, target=attachment)
        else:
            notify_about_student_activity(current_user, student, competency.roadmap,
                                          verb=Notification.NEW_FILE_ATTACHED, target=attachment)

    def on_missing_attachment_user(self, result):
        current_user = self.request.user
        if current_user.is_admin():
            pass  # When admin attaches a file without specifying a user that means it's a global attachment
        elif current_user.is_coach():
            raise ValidationError({'user': 'This field is required'})
        elif current_user.is_student():
            result['user'] = current_user


class UserRoadmapsMixin:
    def get_assigned_roadmaps(self):
        current_user = self.request.user
        student = self.get_student()
        if current_user != student and current_user.is_student() and current_user.groups.count() == 1:
            raise PermissionDenied("Current user can't work with assigned roadmaps of others")
        if current_user.company.users_can_assign_specific_coaches_for_specific_roadmaps:
            admin_filter = lambda a: a.roadmap.company == current_user.company
            coach_filter = lambda a: a.coach == current_user and a.roadmap.company == current_user.company
            if current_user_role_is_overriden(self):
                effective_filter = get_effective_current_user_role_object(self, admin_filter, coach_filter)
            elif current_user.is_admin():
                effective_filter = admin_filter
            elif current_user.is_coach():
                effective_filter = coach_filter
            else:
                effective_filter = lambda a: False
            roadmap_list = list(
                map(lambda a: a.roadmap.id, filter(effective_filter, student.get_current_assigned_roadmaps())))
            roadmaps = Roadmap.objects.filter(pk__in=roadmap_list)
        else:
            roadmaps = self.apply_roadmaps_ordering(student.roadmaps.filter(company=current_user.company))
        return roadmaps

    def get_archived_roadmaps(self):
        current_user = self.request.user
        student = self.get_student()
        return self.apply_roadmaps_ordering(student.archived_roadmaps.filter(company=current_user.company))

    def get_student(self):
        return get_object_or_404(User, pk=self.kwargs['parent_lookup_student'])

    @staticmethod
    def apply_roadmaps_ordering(roadmaps_qs):
        return roadmaps_qs.extra(
            select={'int_name': "CAST(REGEXP_SUBSTR(title, '\[0-9]+') AS INTEGER)"}).order_by('int_name', 'title')


def copy_object(viewset, model, copy_impl):
    obj_to_copy = get_object_or_404(model, pk=viewset.kwargs['pk'])
    copy_impl(obj_to_copy)
    new_object = model.objects.get(pk=obj_to_copy.id)
    new_object_serializer = viewset.get_serializer(new_object)
    return Response(new_object_serializer.data, status=status.HTTP_201_CREATED)


def reorder_objects(viewset, request, model, iterable_getter):
    container_object = get_object_or_404(model, pk=viewset.kwargs['pk'])
    mapping = request.data.get('order_mapping')
    if not mapping or not isinstance(mapping, dict):
        raise ValidationError(
            {'order_mapping': f"Mapping of objects to order values is missing or of invalid format"})

    with transaction.atomic():
        for child_object in iterable_getter(container_object):
            if not str(child_object.id) in mapping:
                raise ValidationError(
                    {'order_mapping': f"One or more objects are missing from mapping of objects to order values"})
            child_object.order = int(mapping[str(child_object.id)])
            child_object.save()

    return Response(status=status.HTTP_200_OK)


def bulk_assign(request, data_key, current_object_ids_getter, objects_qs, assign_impl, unassign_impl):
    if data_key not in request.data:
        raise ValidationError({data_key: 'This field is required'})
    current_object_ids = set(current_object_ids_getter())
    new_object_ids = set(request.data[data_key])
    with transaction.atomic():
        objects_to_add_ids = new_object_ids.difference(current_object_ids)
        objects_to_remove_ids = current_object_ids.difference(new_object_ids)
        all_objects = objects_qs.filter(pk__in=[*objects_to_add_ids, *objects_to_remove_ids])
        for object_id in objects_to_add_ids:
            assign_impl(next(filter(lambda o: o.pk == object_id, all_objects)))
        for object_id in objects_to_remove_ids:
            unassign_impl(next(filter(lambda o: o.pk == object_id, all_objects)))
    return Response(status=status.HTTP_200_OK)
