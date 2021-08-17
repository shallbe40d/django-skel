#-*- coding:utf-8 -*-
import json as JSON
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from bs4 import BeautifulSoup

# Create your views here.

def index(request):
    return HttpResponse("Welcome wireFrame!")

def tdd(request):
    html = open('static/index.html', 'r')
    with open('device.json', 'r') as j:
        data = j.read()
        contents = JSON.loads(data)
        soup = BeautifulSoup(html, 'html.parser')
        ver = soup.select_one('.version')
        #ver.replace_with(data['version'])
        return HttpResponse(soup.text)
    return HttpResponse("empty")

def json(request):
    with open('device.json', 'r') as j:
        data = j.read()
        contents = JSON.loads(data)
        return JsonResponse(contents)
    return JsonResponse({'error': 'can not read device.json'})
