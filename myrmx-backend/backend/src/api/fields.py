from collections import OrderedDict
from django.contrib.auth.models import Group
from rest_framework import serializers


class GroupStringRelatedField(serializers.StringRelatedField):
    def to_internal_value(self, data):
        return Group.objects.get(name=data)


class PkWithStringRelatedField(serializers.PrimaryKeyRelatedField):
    def to_representation(self, obj):
        return {'id': obj.pk, 'text': str(obj)}

    def to_internal_value(self, data):
        return super().to_internal_value(data['id'] if isinstance(data, dict) else data)

    def get_choices(self, cutoff=None):
        queryset = self.get_queryset()
        if queryset is None:
            # Ensure that field.choices returns something sensible
            # even when accessed with a read-only field.
            return {}

        if cutoff is not None:
            queryset = queryset[:cutoff]

        return OrderedDict([
            (
                item.pk,
                self.display_value(item)
            )
            for item in queryset
        ])
