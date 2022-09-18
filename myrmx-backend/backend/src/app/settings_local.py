from .settings_base import *

AWS_S3_BUCKET_NAME = 'local.myroadmap.io'

rest_framework_auth_classes = REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES']
REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = tuple([
    *rest_framework_auth_classes,
    'rest_framework.authentication.SessionAuthentication',
])

CORS_ORIGIN_WHITELIST = [
    "http://localhost:8000",   # Backend itself
    "http://localhost:3100",   # MyRoadmap React.js-based app
    "https://localhost:3100",  # MyRoadmap React.js-based app served via HTTPS
]

DJANGO_FRONTEND_BASE_URL = "http://localhost:8000"
REACT_FRONTEND_BASE_URL = "http://localhost:3100"

try:
    from .local_settings import *
except ImportError:
    pass
