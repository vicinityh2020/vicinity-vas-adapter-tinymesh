import pytz
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from adapter.models import Room, Event

@api_view(['GET'])
def last_event_for_room_by_id(req, room_id):
    try:
        event = Event.objects.filter(event_id=room_id).latest('time_of_event')
        cet_tz = pytz.timezone("CET")
        resp = {
            'room': event.event_id.name,
            'time_of_event': event.time_of_event.astimezone(cet_tz)
        }
    except ObjectDoesNotExist as exp:
        resp = {
            "msg": "Error id does not exist or no events",
        }

    return Response(resp)
