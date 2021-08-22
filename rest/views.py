#-*- coding:utf-8 -*-
import json as JSON
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from bs4 import BeautifulSoup

# Create your views here.
"""
json 객체에서 문자열 패턴으로 값을 가져온다 
문자열 패턴은 . 으로 split
eg) a.b.c
"""
def _get_obj(obj, que):
    ques = que.split('.')
    d_obj = obj
    for o in ques:
        if type(d_obj) is list:
            d_obj = d_obj[int(o)]
        else:
            d_obj = d_obj[o]
    return d_obj
"""
html 소스와 json data를 바인딩
"""
def _bind_data(html_path):
    html = open('static/' + html_path +'.html', 'r')
    with open('device.json', 'r') as j:
        data = JSON.loads(j.read())
        soup = BeautifulSoup(html, 'html.parser')
        objs = soup.select('.\\$wf')
        for o in objs:
            o.string.replace_with(_get_obj(data, o['class'][1]))
        return HttpResponse(soup.prettify())
    return HttpResponse("empty")
"""
/rest/index
"""
def index(request):
    return HttpResponse("Welcome wireFrame!")
"""
/rest/tdd
"""
def tdd(request):
    print(request)
    return _bind_data('index')

def wf(request,path):
    print(request)
    return _bind_data(path)
"""
/rest/json
"""
def json(request):
    with open('device.json', 'r') as j:
        data = j.read()
        contents = JSON.loads(data)
        return JsonResponse(contents)
    return JsonResponse({'error': 'can not read device.json'})
