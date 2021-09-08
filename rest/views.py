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
from django.contrib.sessions.models import Session

import rest.feature as ft

# +---------------------------+
# |     private functions     |
# +---------------------------+
""" now test phase """
def _change_ip():
    # dns 2개도 수정해야함
    call(["ifconfig", "en1", "172.30.1.42", "netmask", "255.255.255.0", "broadcast", "172.30.1.255"])
    call(["route", "add", "default" "gw" "172.30.1.1"])


""" 최초 로그인 사용자의 비번 변경 """
def _change_pw(request, new_pw='', confirm_pw=''):
    if request.session.get('id') and new_pw == confirm_pw:
        con = sqlite3.connect('db.sqlite3', detect_types=sqlite3.PARSE_COLNAMES)
        cur = con.cursor()
        query = f"UPDATE member SET pw='{new_pw}', login1st=1 where id='{request.session.get('id')}'"
        print(query)
        cur.execute(query)
        request.session['login1st'] = 1
        cur.close()
        con.commit()
        con.close()
        return {"result": True} 
    else:
        return {"result": False}


""" login session 정보 반환 """
def _get_member(request):
    return {
        "member": {
            "id": request.session.get("id"),
            "name": request.session.get("name")
        }
    }


""" login을 위한 member table select """
def _login(request, req_id='', req_pw=''):
    con = sqlite3.connect('db.sqlite3', detect_types=sqlite3.PARSE_COLNAMES)
    cur = con.cursor()
    cur.execute(f"SELECT id, pw, name, login1st FROM member where id='{req_id}' and pw='{req_pw}'")
    col = [member[0] for member in cur.description]
    result = {} 
    fetch = cur.fetchone()
    if fetch != None: 
        row = list(fetch)
        for i in range(len(row)):
            result[col[i]] = row[i] 
        request.session['id'] = req_id
        request.session['name'] = result['name'] 
        request.session['login1st'] = result['login1st']
    else:
        result["err"] = "not exists"
    cur.close()
    con.close()
    return {"member": result}


""" member table list """
def _member_list(request):
    con = sqlite3.connect('db.sqlite3', detect_types=sqlite3.PARSE_COLNAMES)
    cur = con.cursor()
    cur.execute(f"SELECT idx, id, pw, name, email, tel, login1st, role FROM member order by idx desc")
    col = [member[0] for member in cur.description]
    rows = cur.fetchall()
    list_result = []
    if rows != None: 
        for row in rows:
            result = {} 
            row_data = list(row)
            for i in range(len(row_data)):
                result[col[i]] = row_data[i] 
            list_result.append(result)
    cur.close()
    con.close()
    return {"member": list_result}


#+---------------------+
#|     url mapping     |
#+---------------------+
""" [ /rest/change_pw ] """
def change_pw(request):
    new_pw = request.POST.get('new_pw')
    if new_pw == None:
        new_pw = ""
    #
    confirm_pw = request.POST.get('confirm_pw')
    if confirm_pw == None:
        confirm_pw = ""
    #
    return JsonResponse(_change_pw(request, new_pw, confirm_pw))


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
    if request.session.get('id'):
       del(request.session)
    #
    return redirect('/wf/00_001.html')


""" [ /rest/member_list ] """
def member_list(request):
    return JsonResponse(_member_list(request))


""" [ /wf/*.html ] static 폴더의 html 과 json을 bind 하여 새로운 html 출력 """
def wf(request, path):
    #Singleton()
    if not request.session.get('id', False):
        path =  "00_001"
    elif request.session.get('login1st') == 0:
        path =  "00_002"
    return HttpResponse(ft._bind_data(path, _get_member(request)))


""" [ /rest/json ] json data 테스트 및 검증용 """
def json(request):
    print(request.GET.get('id'))
    with open('device.json', 'r') as j:
        data = j.read()
        contents = JSON.loads(data)
        contents['now'] = str(datetime.datetime.now())
        return JsonResponse(contents)
    return JsonResponse({'error': 'can not read device.json'})
#
# +-------------------------------+
# |     Singleton for Session     |
# +-------------------------------+
class Singleton(object):
    def __new__(cls, *args, **kwargs):
        if not hasattr(cls, "_instance"):         
            print("clear session")
            Session.objects.all().delete()
            cls._instance = super().__new__(cls)  
        return cls._instance                      

    def __init__(self):
        print("init")
        
