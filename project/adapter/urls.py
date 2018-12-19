from django.urls import path
from adapter import views
from auth.api import UserAPI, LoginAPI

urlpatterns = [
    path('room-overview', views.rooms_info),
    path('clean-room/<int:room_id>', views.CleaningView.as_view()),
    path('objects', views.thing_description),
    path('objects/<subscriber_id>/events/<eid>', views.receive_event),
    path('objects/<subscriber_id>/publishers/<oid>/events/<eid>', views.receive_event_new),
    path('weather', views.fetch_weather_moss),
    path("user", UserAPI.as_view()),
    path("login", LoginAPI.as_view()),
]