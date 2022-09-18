from .settings_base import *

ALLOWED_HOSTS = [
    'myroadmap-stage.us-west-2.elasticbeanstalk.com',
    'stage.myroadmap.io',
]

DATABASES['default']['NAME'] = 'myroadmap-stage'
if 'readonly' in DATABASES:
    DATABASES['prod-readonly'] = DATABASES['readonly'].copy()
    DATABASES['readonly']['NAME'] = 'myroadmap-stage'

AWS_S3_BUCKET_NAME = 'stage.myroadmap.io'

CORS_ORIGIN_WHITELIST = [
    'https://stage.myroadmap.io',
    'http://myroadmap-react-stage.us-west-2.elasticbeanstalk.com',
    'https://react-app-stage.myroadmap.io',
]

DJANGO_FRONTEND_BASE_URL = "https://stage.myroadmap.io"
REACT_FRONTEND_BASE_URL = "https://react-app-stage.myroadmap.io"

# TODO: Decide on what to do with cronjobs on stage

DISPLAY_STAGING_BANNER = True
