"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path, include

from auth import urls as endpoints
from project import views
from diagnostics import views as diag_views

urlpatterns = [
    path('adapter/', include('adapter.urls')),
    path('adapter/admin', admin.site.urls),
    path('api/', include(endpoints)),
    path('api/auth/', include('knox.urls')),
    path('diagnostics/get_last_event_by_id/<int:room_id>', diag_views.last_event_for_room_by_id),
    url(r'^', views.FrontendAppView.as_view())
]


urlpatterns += staticfiles_urlpatterns()
