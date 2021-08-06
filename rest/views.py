from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

# Create your views here.

def index(request):
    return HttpResponse("Welcome wireFrame!")

def json(request):
    return JsonResponse({'foo':'bar'})
