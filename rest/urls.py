from django.urls import path
from django.conf.urls import include, url
from rest import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'login', views.login, name='login'),
    url(r'json', views.json, name='json'),
    path(r'<str:path>.html', views.wf, name='wf'),
]
