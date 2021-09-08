import json as JSON
import sqlite3
import datetime

from bs4 import BeautifulSoup

# +---------------------------+
# |     Feature Functions     |
# +---------------------------+
""" html 소스와 json data를 바인딩 """
def _bind_data(html_path, db=[]):
    html = open('static/' + html_path +'.html', 'r')
    soup = BeautifulSoup(html, 'html.parser')
    #
    include_list = [
        {'sel': 'body > div:nth-of-type(1)#layout-wrapper > header#page-topbar', 'inc': 'page-topbar.htm'},
        {'sel': 'body > div:nth-of-type(1)#layout-wrapper > div#vertical-menu', 'inc': 'vertical-menu.htm'},
        {'sel': 'footer.footer', 'inc': 'footer.htm'},
        {'sel': 'body > div#notSetModal', 'inc': 'notSetModal.htm'}
    ]
    #
    for elm in include_list:
        node = soup.select(elm['sel'])
        if len(node) > 0:
            s_html = open('static/' + elm['inc'], 'r')
            newElm = BeautifulSoup(s_html, 'html.parser')
            newElm.insert(0, BeautifulSoup(f"<!-- [ {elm['inc']} -->", 'html.parser'))
            newElm.append(BeautifulSoup(f"<!-- {elm['inc']} ] -->", 'html.parser'))
            node[0].replace_with(newElm)
        #
    #
    while True:
        inc_file = soup.select('.\\$inc')
        if len(inc_file) == 0:
            break
        #
        for f in inc_file:
            if 'inc' in f.attrs.keys():
                sub_html = open('static/' + f.attrs['inc'], 'r') 
                f.replace_with(BeautifulSoup(sub_html, 'html.parser'))
            #
        #
    #
    with open('device.json', 'r') as j:
        data = JSON.loads(j.read())
        data['db'] = db
        data['path'] = html_path
        data['now'] = str(datetime.datetime.now())
        print(data)
        #
        objs = soup.select('.\\$wf')
        #
        for o in objs:
            o.string.replace_with(_get_obj(data, o['class'][1]))
        comm_js = soup.new_tag("script", src="/wf/commJs")
        env_js = soup.new_tag("script")
        env_js.append(f"window.path='{html_path}';")
        soup.append(env_js)
        soup.append(comm_js)
        #
        soup.append(soup.new_tag("script", src="http://localhost:8080/skewer"))
        #
        return soup.prettify()
    #
    return "empty"


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


