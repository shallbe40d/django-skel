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
    url(r'member/(?P<req_id>[0-9]+)$', views.member_get, name='member_get'),
    url(r'member/delete/(?P<req_id>[0-9]+)$', views.member_delete, name='member_delete'),
    url(r'member/update/(?P<req_id>[0-9]+)$', views.member_update, name='member_update'),
    url(r'member_list', views.member_list, name='member_list'),

    path(r'net_info', views.net_info, name='net_info'),

    url(r'device', views.device, name='device'),

    url(r'commJs', views.commJs, name='commJs'),
    path(r'chart', views.chart, name='chart'),
    path(r'download', views.download, name='download'),
    path(r'<str:path>.html', views.wf, name='wf'),
] + static("assets", document_root="static/assets")

