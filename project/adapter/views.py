import json
import logging
from datetime import datetime

from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.utils.dateparse import parse_datetime

from adapter.models import Event, Room, CleaningHistory

logger = logging.getLogger("adapter")


@csrf_exempt
def thing_description(request):
    description = {
        "adapter-id": settings.ADAPTER_ID,
        "thing-descriptions": [
            {
                "oid": settings.SERVICE_ID,
                "name": settings.SERVICE_NAME,
                "type": "core:Service",
                "properties": [],
                "actions": [],
                "events": []
            }
        ]
    }

    return JsonResponse(description)


@csrf_exempt
def receive_event(request, subscriber_id, eid):
    if request.method == 'PUT':
        json_data = json.loads(request.body)

        # will return existing room or create a new one with defaults if one doesnt exists
        # room[0] == true then room didn't exist
        room = Room.objects.get_or_create(door_eid=eid)

        if room[1]:
            logger.info(f"Creating default room object for new door with oid={eid}")
        else:
            logger.info(f"Adding event to existing room {room[0].name}")

        event = Event(time_of_event=parse_datetime(json_data['timestamp']),
                      door_state=json_data['value'],
                      event_id=room[0])
        room[0].visits += 1
        room[0].save()
        event.save()
        return JsonResponse({'ok': True})

    return JsonResponse({'ok': False}, status=403)


def rooms_info(request):
    response_body = []
    rooms = Room.objects.all()
    for room in rooms:
        response_body.append({
            'id': room.id,
            'name': room.name,
            'visits': room.visits / 2,
            'needsCleaning': (room.visits / 2) > room.threshold
        })

    return JsonResponse(response_body, safe=False)


@csrf_exempt
def clean_room(request, room_id):
    if request.method == "POST":
        req_body = json.loads(request.body)
        print(req_body)
        room = Room.objects.get(id=room_id)
        clean_event = CleaningHistory(room=room,
                                      datetime=datetime.utcnow(),
                                      number_of_visits=room.visits / 2,
                                      threshold=room.threshold,
                                      who=User.objects.get(username="admin"))
        room.visits = 0

        logger.debug("Saving updated room object and adding entry to history")
        logger.debug(f"HistoryEntry: \n"
                     f"\tRoom Name: {clean_event.room.name}\n"
                     f"\tTime: {clean_event.datetime}\n"
                     f"\tNumber of visits: {clean_event.number_of_visits}\n"
                     f"\tThreshold: {clean_event.threshold}")
        room.save()
        clean_event.save()
        all_events_for_room = Event.objects.filter(event_id=room)
        if len(all_events_for_room):
            logger.debug(f"Deleting all events for room: \"{room.name}\"(id:{room.id})")
            all_events_for_room.delete()
        else:
            logger.debug(f"No events for room: \"{room.name}\"[id:{room.id}]")

    return JsonResponse({"OK": True})
