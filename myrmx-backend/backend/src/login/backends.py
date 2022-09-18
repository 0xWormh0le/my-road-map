from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


UserModel = get_user_model()


class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, email=None, password=None, company_id=None, **kwargs):
        lookup_args = {}
        if email:
            lookup_args['email'] = email
        elif username:
            lookup_args['username'] = username
        if company_id:
            lookup_args['company_id'] = company_id
        try:
            user = UserModel.objects.get(**lookup_args)
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            UserModel().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
