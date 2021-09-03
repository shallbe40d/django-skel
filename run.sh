#!/bin/sh

# clear django_session table
DJANGO_SETTINGS_MODULE="wireframe.settings" python -c 'from django.contrib.sessions.models import Session; Session.objects.all().delete()' 
./env/bin/python manage.py runserver
