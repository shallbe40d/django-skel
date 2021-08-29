from django.urls import path
from django.conf.urls import include, url
from rest import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'tdd', views.tdd, name='tdd'),
    url(r'json', views.json, name='json'),
    path(r'<str:path>.html', views.wf, name='wf'),
] + static("assets", document_root="static/assets")
