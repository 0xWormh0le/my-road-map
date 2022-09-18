from .settings_base import *

ALLOWED_HOSTS = [
    'myroadmap-dev.us-west-2.elasticbeanstalk.com',
    'dev.myroadmap.io',
]

DATABASES['default']['NAME'] = 'myroadmap-dev'
if 'readonly' in DATABASES:
    DATABASES['prod-readonly'] = DATABASES['readonly'].copy()
    DATABASES['readonly']['NAME'] = 'myroadmap-dev'

AWS_S3_BUCKET_NAME = 'dev.myroadmap.io'

CORS_ORIGIN_WHITELIST = [
    'https://dev.myroadmap.io',
    'http://myroadmap-react-dev.us-west-2.elasticbeanstalk.com',
    'https://react-app-dev.myroadmap.io',
]

DJANGO_FRONTEND_BASE_URL = "https://dev.myroadmap.io"
REACT_FRONTEND_BASE_URL = "https://react-app-dev.myroadmap.io"

# TODO: Decide on what to do with cronjobs on dev

DISPLAY_STAGING_BANNER = True
