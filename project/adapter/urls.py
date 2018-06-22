from django.contrib import admin
from django.urls import path, include, re_path
from adapter import views

urlpatterns = [
    re_path(r'objects$', views.thing_description),
]
