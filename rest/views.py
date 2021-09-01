#-*- coding:utf-8 -*-
import json as JSON
import sqlite3
import datetime

from subprocess import call
from bs4 import BeautifulSoup

from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import redirect

# +---------------------------+
# |     private functions     |
# +---------------------------+
""" now test phase """
def _change_ip():
    # dns 2개도 수정해야함
    call(["ifconfig", "en1", "172.30.1.42", "netmask", "255.255.255.0", "broadcast", "172.30.1.255"])
    call(["route", "add", "default" "gw" "172.30.1.1"])


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


""" login session 정보 반환 """
def _get_member(request):
    return {"member": request.session.get('user')}


""" login을 위한 member table select """
def _login(request, req_id='', req_pw=''):
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
        request.session['user'] = req_id
    else:
        result["err"] = "not exists"
    cur.close()
    con.close()
    return {"member": result}


""" html 소스와 json data를 바인딩 """
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
        print(data)
        head = soup.select('head')
        comm_js = soup.new_tag("script", src="/wf/commJs")
        soup.append(comm_js)
        return HttpResponse(soup.prettify())
    return HttpResponse("empty")


#+---------------------+
#|     url mapping     |
#+---------------------+

""" [ /wf/commonJs ] """
def commJs(request):
    js = open('common.js', 'r')
    return HttpResponse(js, content_type="application/x-javascript")


""" [ /rest/index ] """
def index(request):
    return HttpResponse("Welcome wireFrame!")


""" [ /rest/login ] """
def login(request):
    req_id = request.POST.get('id')
    if req_id == None:
        req_id = ""
    #
    req_pw = request.POST.get('pw')
    if req_pw == None:
        req_pw = ""
    #
    return JsonResponse(_login(request, req_id, req_pw))


""" [ /rest/logout ] """
def logout(request):
    if request.session.get('user'):
       del(request.session['user'])
    #
    return redirect('/wf/00_001.html')


""" [ /wf/*.html ] static 폴더의 html 과 json을 bind 하여 새로운 html 출력 """
def wf(request, path):
    if not request.session.get('user', False):
        path =  "00_001"
    return _bind_data(path, _get_member(request))


""" [ /rest/json ] json data 테스트 및 검증용 """
def json(request):
    print(request.GET.get('id'))
    with open('device.json', 'r') as j:
        data = j.read()
        contents = JSON.loads(data)
        contents['now'] = str(datetime.datetime.now())
        return JsonResponse(contents)
    return JsonResponse({'error': 'can not read device.json'})
