import os

from celery import Celery
from django.conf import settings

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chat_bot.settings")

app = Celery("chat_bot")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Set worker pool based on OS (from Django settings)
app.conf.worker_pool = settings.CELERY_WORKER_POOL
# Load task modules from all registered Django apps.
app.autodiscover_tasks()
