#-*- coding:utf-8 -*-
import json as JSON
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

import sqlite3
import datetime

from bs4 import BeautifulSoup

# Create your views here.
""" 
json 객체에서 문자열 패턴으로 값을 가져온다 
문자열 패턴은 . 으로 split
eg) a.b.c
"""
def _get_obj(obj, que):
    try: 
        ques = que.split('.')
        d_obj = obj
        for o in ques:
            if o.isdigit():
                d_obj = d_obj[int(o)]
            else:
                d_obj = d_obj[o]
        return d_obj
    except:
        return "" 

""" 
login을 위한 member table select 
"""
def _get_member(req_id='admin', req_pw='1234'):
    con = sqlite3.connect('db.sqlite3', detect_types=sqlite3.PARSE_COLNAMES)
    cur = con.cursor()
    cur.execute(f"SELECT id, pw, name FROM member where id='{req_id}' and pw='{req_pw}'")
    col = [member[0] for member in cur.description]
    result = {} 
    fetch = cur.fetchone()
    if fetch != None: 
        row = list(fetch)
        for i in range(len(row)):
            result[col[i]] = row[i] 
    else:
        result["err"] = "not exists"
    cur.close()
    con.close()
    return {"member": result}

""" 
html 소스와 json data를 바인딩 
"""
def _bind_data(html_path, db=[]):
    html = open('static/' + html_path +'.html', 'r')
    with open('device.json', 'r') as j:
        data = JSON.loads(j.read())
        data['db'] = db
        data['now'] = str(datetime.datetime.now())
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
/rest/login 
"""
def login(request):
    req_id = request.POST.get('id')
    if req_id == None:
        req_id = ""
    #
    req_pw = request.POST.get('pw')
    if req_pw == None:
        req_pw = ""
    #
    return JsonResponse(_get_member(req_id, req_pw))
""" 
/wf/*.html 
static 폴더의 html 과 json을 bind 하여 새로운 html 출력
"""
def wf(request,path):
    return _bind_data(path, _get_member())

""" 
/rest/json
"""
def json(request):
    print(request.GET.get('id'))
    with open('device.json', 'r') as j:
        data = j.read()
        contents = JSON.loads(data)
        contents['db'] = _get_member()
        contents['now'] = str(datetime.datetime.now())
        return JsonResponse(contents)
    return JsonResponse({'error': 'can not read device.json'})
