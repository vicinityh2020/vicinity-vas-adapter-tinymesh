from django.urls import path
from adapter import views

urlpatterns = [
    path('room-overview', views.rooms_info),
    path('clean-room/<int:room_id>', views.CleaningView.as_view()),
    path('objects', views.thing_description),
    path('objects/<subscriber_id>/events/<eid>', views.receive_event),
    path('weather', views.fetch_weather_moss)
]
