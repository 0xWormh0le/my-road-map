from django.utils.timezone import now
from .models import User


class LastSeenMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = self.get_response(request)

        if request.user.is_authenticated:
            User.objects.filter(id=request.user.id).update(last_seen=now())
        # Code to be executed for each request/response after
        # the view is called.

        return response

def PostmanCompanyMiddleware(get_response):
    def middleware(request):
        # bearer_token = request.META.get("HTTP_AUTHORIZATION", "")
        # if bearer_token.startswith("Bearer"):
        #     user = get_user_from_token(bearer_token)
        #     if user:
        #         request.user = request._cached_user = user
        if request.path == '/messages/write/' and request.method == 'POST':
            print("request")
            print(request.body)
        return get_response(request)
    return middleware
