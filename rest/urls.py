from django.urls import path
from django.conf.urls import include, url
from rest import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    url(r'^$', views.index, name='index'),

    url(r'json', views.json, name='json'),

    url(r'change_pw', views.change_pw, name='change_pw'),

    url(r'login', views.login, name='login'),
    url(r'logout', views.logout, name='logout'),

    url(r'member_add', views.member_add, name='member_add'),
    url(r'member_list', views.member_list, name='member_list'),

    url(r'commJs', views.commJs, name='commJs'),
    path(r'<str:path>.html', views.wf, name='wf'),
] + static("assets", document_root="static/assets")

