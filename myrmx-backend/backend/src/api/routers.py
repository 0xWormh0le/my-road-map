from rest_framework.permissions import AllowAny
from rest_framework.reverse import reverse
from rest_framework.routers import DefaultRouter
from rest_framework_extensions.routers import NestedRouterMixin


class HybridRouter(NestedRouterMixin, DefaultRouter):
    """
    Welcome to this REST API!

    This API follows typical REST API guidelines.
    Allowed HTTP methods for any API URL are listed in 'Allow' HTTP header value of an API's response.
    Sending a GET request to the API root will return list of available endpoints.

    Sending an OPTIONS request to any API URL will return detailed description of that particular URL.
    Typically it'll contain 'renders' and 'parses' sections and URL-specific info.
    Renders section lists formats API can return ('Content-Type' HTTP header value of an API's response).
    Parses section lists formats API can handle ('Content-Type' HTTP header value of a request to API).

    API choose most suitable format based on the 'Accept' HTTP header value of a request to API.
    You can override desirable rendering format by using 'format' query parameter with any URL, e.g. '?format=json'.

    Sending a GET request to a typical resource endpoint URL will return the list of available resources.
    Sending an OPTIONS request to it will return detailed info about how particular HTTP methods can be executed.

    Sending a POST request to a typical resource endpoint URL will create a new resource.
    POST request's data schema is available in the response to OPTIONS request.

    Each individual resource can be accessed by the URL which is typically provided in it's data.
    By convention such URL also can be typically constructed as "[resource endpoint URL]/[resource instance id]".

    Various HTTP methods are typically available for individual resource URL.
    GET is used to retrieve resource data.
    PUT is used to change the whole resource (no id or URL is needed).
    PATCH is used to change particular field set.
    DELETE is used to delete the resource.

    Some endpoints allow filtering. Use 'Filters' button in the Browsable API to access filtering easily.

    There's an OpenAPI Schema for this API available also.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.view_urls = []

    def add_url(self, view):
        self.view_urls.append(view)

    def get_urls(self):
        return super().get_urls() + self.view_urls

    def get_api_root_view(self, api_urls=None):
        original_view = super().get_api_root_view(api_urls)
        original_view.cls.__doc__ = self.__class__.__doc__
        original_view.cls.permission_classes = (AllowAny,)

        def view(request, *args, **kwargs):
            resp = original_view(request, *args, **kwargs)
            if request.method.lower() != 'options':
                namespace = request.resolver_match.namespace
                for view_url in self.view_urls:
                    name = view_url.name
                    url_name = name
                    if namespace:
                        url_name = namespace + ':' + url_name
                    resp.data[name] = reverse(
                        url_name, args=args, kwargs=kwargs, request=request, format=kwargs.get('format', None))
            return resp

        return view
