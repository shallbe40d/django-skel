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
""" 
now test phase 
"""
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


""" device.json data """
def _device_data(request):
    print(request.GET.get('id'))
    with open('device.json', 'r') as j:
        data = j.read()
        contents = JSON.loads(data)
        contents['now'] = str(datetime.datetime.now())
    return contents


""" update device.json """
def _device_set(request):
    result = False
    data_str = request.POST.get('data')
    try:
        with open("device.json", "w") as f:
            f.write(data_str)
        result = True
    except:
        print("device save error")
    return {"result": result}


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
    cur.execute(f"SELECT id, pw, name, login1st, role FROM member where id='{req_id}' and pw='{req_pw}'")
    col = [member[0] for member in cur.description]
    result = {} 
    fetch = cur.fetchone()
    if fetch != None: 
        row = list(fetch)
        for i in range(len(row)):
            result[col[i]] = row[i] 
        request.session['id'] = req_id
        request.session['name'] = result['name'] 
        request.session['role'] = result['role'] 
        request.session['login1st'] = result['login1st']
    else:
        result["err"] = "not exists"
    cur.close()
    con.close()
    return {"member": result}


""" member table add """
def _member_add(request):
    id = request.POST.get('id')
    if id == None: return {"result": False}
    pw = request.POST.get('pw')
    if pw == None: return {"result": False}
    name = request.POST.get('name')
    if name == None: return {"result": False}
    #
    email = request.POST.get('email')
    tel = request.POST.get('tel')
    role = request.POST.get('role')
    #
    if request.session.get('id') and request.session.get('role') == -1:
        #
        con = sqlite3.connect('db.sqlite3', detect_types=sqlite3.PARSE_COLNAMES)
        cur = con.cursor()
        #
        cur.execute(f"SELECT idx FROM member where id='{id}'")
        rows = cur.fetchall()
        if len(rows) > 0:
            cur.close()
            con.close()
            return { "result": False, "msg": "exists id" }
        else:
            query = f"INSERT into member (id, pid, pw, name, email, tel, role) values('{id}', '{request.session.get('id')}', '{pw}', '{name}', '{email}', '{tel}', {role});"
            cur.execute(query)
            cur.close()
            con.commit()
            con.close()
            return {"result": True} 
    else:
        return {"result": False}


""" member delete """
def _member_delete(request, req_id):
    result = False
    if request.session.get('id') and request.session.get('role') == -1:
        #
        con = sqlite3.connect('db.sqlite3', detect_types=sqlite3.PARSE_COLNAMES)
        cur = con.cursor()
        cur.execute(f"delete FROM member where idx='{req_id}'")
        cur.close()
        con.commit()
        con.close()
        result = True
    #
    return {"result": result}


""" member description """
def _member_get(request, req_id):
    if request.session.get('id') and request.session.get('role') == -1:
        #
        con = sqlite3.connect('db.sqlite3', detect_types=sqlite3.PARSE_COLNAMES)
        cur = con.cursor()
        cur.execute(f"SELECT * FROM member where idx='{req_id}'")
        col = [member[0] for member in cur.description]
        result = {} 
        fetch = cur.fetchone()
        if fetch != None: 
            row = list(fetch)
            for i in range(len(row)):
                result[col[i]] = row[i] 
            result['pw'] = '' 
        else:
            result["err"] = "not exists"
        cur.close()
        con.close()
    #
    return {"member": result}


""" member table list """
def _member_list(request):
    con = sqlite3.connect('db.sqlite3', detect_types=sqlite3.PARSE_COLNAMES)
    cur = con.cursor()
    cur.execute(f"SELECT * FROM member order by idx desc")
    col = [member[0] for member in cur.description]
    rows = cur.fetchall()
    list_result = []
    if rows != None: 
        for row in rows:
            result = {} 
            row_data = list(row)
            for i in range(len(row_data)):
                result[col[i]] = row_data[i] 
            result['pw'] = ''
            list_result.append(result)
    cur.close()
    con.close()
    return {"member": list_result}


""" member update """
def _member_update(request, req_id):
    result = False
    pw = request.POST.get('pw')
    up_data = ""

    if pw != None:
        up_data = f"pw='{pw}',"
    else:
        member_id = request.POST.get('id')
        if type(member_id) is tuple:
            member_id = member_id[0]
        name = request.POST.get('name'),
        if type(name) is tuple:
            name = name[0]
        tel = request.POST.get('tel'),
        if type(tel) is tuple:
            tel = tel[0]
        email = request.POST.get('email'),
        if type(email) is tuple:
            email = email[0]
        role = request.POST.get('role')
        if type(role) is tuple:
            role = role[0]
        #
        member_id = f"id='{member_id}'," if member_id != None else ""
        name = f"name='{name}'," if name != None else ""
        tel = f"tel='{tel}'," if tel != None else ""
        email = f"email='{email}'," if email != None else ""
        role = f"role='{role}'," if role != None else ""
        #
        up_data = member_id + name + tel + email + role
    #
    if request.session.get('id') and request.session.get('role') == -1:
        #
        con = sqlite3.connect('db.sqlite3', detect_types=sqlite3.PARSE_COLNAMES)
        cur = con.cursor()
        print(f"UPDATE member set {up_data}  mid='{request.session.get('id')}' where idx='{req_id}'")
        cur.execute(f"UPDATE member set {up_data} modifyDt=current_timestamp,  mid='{request.session.get('id')}' where idx='{req_id}'")
        cur.close()
        con.commit()
        con.close()
        result = True
    #
    return {"result": result}


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
    device_info = f"window['device'] = {JSON.dumps(_device_data(request), sort_keys=True, indent=4)};"
    js = open('common.js', 'r').read()
    #
    return HttpResponse(f"{device_info}\n\n\n{js}", content_type="application/x-javascript")


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


""" [ /rest/member_add] """
def member_add(request):
    return JsonResponse(_member_add(request))


""" [ /rest/member/delte/1 ] """
def member_delete(request, req_id):
    return JsonResponse(_member_delete(request, req_id))


""" [ /rest/member/1 ] """
def member_get(request, req_id):
    return JsonResponse(_member_get(request, req_id))


""" [ /rest/member_list ] """
def member_list(request):
    return JsonResponse(_member_list(request))


""" [ /rest/member/update/1 ] """
def member_update(request, req_id):
    return JsonResponse(_member_update(request, req_id))


""" [ /rest/device ] """
def device(request):
    return JsonResponse(_device_set(request))


""" [ /wf/*.html ] static 폴더의 html 과 json을 bind 하여 새로운 html 출력 """
def wf(request, path):
    #Singleton()
    #print(request.session.get('id', False))
    #print(path)
    if not request.session.get('id', False):
        path =  "00_001"
    elif request.session.get('login1st') == 0:
        path =  "00_002"
    return HttpResponse(ft._bind_data(path, _get_member(request)))


""" [ /rest/json ] json data 테스트 및 검증용 """
def json(request):
    return JsonResponse(_device_data(request))
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
        
