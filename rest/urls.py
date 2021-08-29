from django.urls import path
from django.conf.urls import include, url
from rest import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'login', views.login, name='login'),
    url(r'logout', views.logout, name='logout'),
    url(r'json', views.json, name='json'),
    path(r'<str:path>.html', views.wf, name='wf'),
] + static("assets", document_root="static/assets")

