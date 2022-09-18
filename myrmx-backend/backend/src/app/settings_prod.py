from .settings_base import *

# TODO: This should be cleaned up
ALLOWED_HOSTS = [
    'localhost',
    'myroadmap.webfactional.com',
    '127.0.0.1',
    'lds.myroadmap.io',
    '67.207.88.226',
    'app.myroadmap.io',
    'myroadmap.us-west-2.elasticbeanstalk.com',
    'new.myroadmap.io',
    '192.168.0.104',
    '192.168.0.196',
    '192.168.1.39',
    '5d5b513a.ngrok.io',
    '10.0.2.2',
    '28720f30.ngrok.io',
    'app.parentguidance.org',
    '172.31.5.6',
    '172.31.36.219',
]

AWS_S3_BUCKET_NAME = 'myroadmap.io'

CORS_ORIGIN_WHITELIST = [
    'https://app.myroadmap.io',  # Primary backend domain
    'http://myroadmap-react-prod.us-west-2.elasticbeanstalk.com',  # Primary Elastic Beanstalk domain
    'https://react-app.myroadmap.io',  # ParentGuidance.org frontend domain
    'https://brightermornings.myroadmap.io',  # Brighter Mornings frontend domain
    "https://home.myroadmap.io",  # Primary frontend domain
]

CRONJOBS = [
    # every day at 12:00pm MST
    ('00 18 * * *', 'dashboard.cron.send_coach_daily_digest'),
    ('00 18 * * *', 'dashboard.cron.send_user_daily_digest'),
    ('00 18 * * *', 'dashboard.cron.send_daily_assessment'),
    ('45 05 * * *', 'dashboard.exports.basic_csv_export'),
    # every day at 2:00pm MST
    ('00 20 * * *', 'dashboard.cron.send_action_item_reminder_email'),
    ('00 20 * * *', 'dashboard.cron.send_action_item_reminder_email_to_coaches'),
]

# Agora

AGORA_APP_ID = "3308eed91bff4d05819801efeff52442"
AGORA_APP_CERTIFICATE = "d9c258047cb74dc1b90ffe53c49c6db7"

DJANGO_FRONTEND_BASE_URL = "https://app.myroadmap.io"
REACT_FRONTEND_BASE_URL = "https://home.myroadmap.io"
