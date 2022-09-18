from rest_framework import serializers


class NestedHyperlinkedIdentityField(serializers.HyperlinkedIdentityField):
    def __init__(self, view_name=None, parent_lookups=None, **kwargs):
        self._parent_lookups = parent_lookups or []
        super().__init__(view_name, **kwargs)

    def get_url(self, obj, view_name, request, format):
        if hasattr(obj, 'pk') and obj.pk in (None, ''):
            return None

        lookup_value = getattr(obj, self.lookup_field)
        kwargs = {self.lookup_url_kwarg: lookup_value}
        for lookup, attr_name in self._parent_lookups:
            lookup_value = obj
            for lookup_part in attr_name.split('__'):
                lookup_value = getattr(lookup_value, lookup_part)
            kwargs[f'parent_lookup_{lookup}'] = lookup_value
        return self.reverse(view_name, kwargs=kwargs, request=request, format=format)


class GenericForeignKeyHyperlinkedIdentityField(serializers.HyperlinkedIdentityField):
    def __init__(self, view_name=None, fk_field_name=None, **kwargs):
        super().__init__(view_name, **kwargs)
        self._fk_field_name = fk_field_name

    def get_url(self, obj, view_name, request, format):
        fk_target_object = getattr(obj, self._fk_field_name)
        if fk_target_object is None:
            return None

        lookup_value = getattr(obj, self.lookup_field)
        kwargs = {self.lookup_url_kwarg: lookup_value}
        # view_name is actually a list of type/view name tuples
        for model_type, view_name in view_name:
            if isinstance(fk_target_object, model_type):
                return self.reverse(view_name, kwargs=kwargs, request=request, format=format)
        # No match found
        return None
