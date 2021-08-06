from django.urls import path
from django.conf.urls import include, url
from rest import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'json', views.json, name='json'),

]
