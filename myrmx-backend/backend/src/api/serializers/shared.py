from django.db.models import Q
from rest_framework import serializers
from rest_framework.fields import empty
from rest_framework.renderers import BrowsableAPIRenderer

from dashboard.models import User, Attachment


class OptimizeUrlFieldsSerializerMixin:
    explicit_url_field_names = []

    def __init__(self, instance=None, data=empty, **kwargs):
        remove_urls_kwarg = kwargs.pop('remove_urls', None)
        super().__init__(instance, data, **kwargs)
        remove_urls = True
        if remove_urls_kwarg is not None:
            remove_urls = remove_urls_kwarg
        elif 'request' in self.context:
            query_params = self.context['request'].query_params
            if 'with-urls' in query_params:
                remove_urls = query_params.get('with-urls') == 'false'
            else:
                remove_urls = not isinstance(
                    self.context['request'].accepted_renderer, BrowsableAPIRenderer)
        if remove_urls:
            field_names_to_remove = []
            for field_name in self.fields.keys():
                is_id_field = isinstance(
                    self.fields[field_name], serializers.HyperlinkedIdentityField)
                is_related_field = isinstance(
                    self.fields[field_name], serializers.HyperlinkedRelatedField)
                is_explicit_field = field_name in self.explicit_url_field_names
                if is_id_field or is_related_field or is_explicit_field:
                    field_names_to_remove.append(field_name)
            for field_name in field_names_to_remove:
                del self.fields[field_name]


def generate_list_view_name(base_name):
    return f'api:{base_name}-list'


def generate_detail_view_name(base_name):
    return f'api:{base_name}-detail'


class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'photo', 'last_seen')


class DefaultAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Attachment
        fields = ('id', 'filename', 'file_type', 'file_url', 'file_category', 'user_id', 'attacher_id')

    @staticmethod
    def get_file_url(instance):
        return instance.attachment.url if instance.attachment else instance.external_url


class CreateAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ('attachment', 'file_category', 'user')
        extra_kwargs = {
            'attachment': {'required': True},
            'file_category': {'required': True, 'allow_blank': False},
        }


class UpdateAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ('filename',)


def is_details_scope_specified(query_params, scope_name):
    return 'details' in query_params and scope_name in query_params['details'].split(',')


class AttachmentsSerializerMixin:
    attachments_filter_kwargs = None

    def get_attachments(self, instance):
        current_user = self.context['request'].user if 'request' in self.context else None
        if not current_user:
            return []
        attachments_qs = instance.attachments.all()
        if self.attachments_filter_kwargs:
            attachments_qs = attachments_qs.filter(**self.attachments_filter_kwargs)
        student_getter = getattr(self, '_get_student', None)
        student = student_getter() if student_getter else None
        if student:
            attachments_qs = attachments_qs.filter(Q(user=student) | Q(user=None))
        if is_details_scope_specified(self.context['request'].query_params, 'attachments'):
            return DefaultAttachmentSerializer(attachments_qs, many=True).data
        return map(lambda a: a.id, attachments_qs)
