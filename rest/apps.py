import os
from django.apps import AppConfig


class RestConfig(AppConfig):
    name = 'rest'
    def ready(self):
        run_once = os.environ.get('CMDLINERUNNER_RUN_ONCE') 
        if run_once is not None:
            return
        os.environ['CMDLINERUNNER_RUN_ONCE'] = 'True' 
        print("init AppConfig")
