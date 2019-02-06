import json
import logging
from datetime import datetime
from pprint import pprint

from django.conf import settings
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from knox.auth import TokenAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from yr import Weather

from adapter.models import Event, Room, CleaningHistory, get_users_full_name

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


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def update_room_settings(request):
    pprint(request.data)
    resp = {"OK": True}
    try:
        room = Room.objects.get(id=request.data['id'])
    except Room.DoesNotExist as ex:
        resp["OK"] = False
        resp["msg"] = str(ex)
        return Response(resp)

    room.notification_phone_number = request.data['phone']
    room.threshold = request.data["newThreshold"]
    room.save()
    return Response(resp)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def rooms_info(request):
    response_body = []
    rooms = Room.objects.all()

    for room in rooms:
        try:
            last_cleaned = CleaningHistory.objects.filter(room=room).order_by('-datetime').latest('datetime')
        except CleaningHistory.DoesNotExist:
            last_cleaned = None

        if last_cleaned is None:
            response_body.append({
                'id': room.id,
                'name': room.name,
                'visits': room.visits / 2,
                'lastCleaned': 'Never',
                'threshold': room.thresold,
                'needsCleaning': (room.visits / 2) > room.threshold,
                'phone': room.notification_phone_number
            })
        else:
            response_body.append({
                'id': room.id,
                'name': room.name,
                'visits': room.visits / 2,
                'lastCleaned': last_cleaned.datetime,
                'threshold': room.threshold,
                'needsCleaning': (room.visits / 2) > room.threshold,
                'phone': room.notification_phone_number
            })

    return JsonResponse(response_body, safe=False)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def fetch_weather_moss(resp):
    weather = Weather()
    temp, percp = weather.get_forecast("Østfold/Moss/Moss", url_path=True)
    return JsonResponse({
        "temp": temp,
        "percp": percp
    })


@method_decorator(csrf_exempt, name='dispatch')
class CleaningView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, room_id):
        cleaning_history = CleaningHistory.objects.filter(room_id=room_id)
        resp_body = {
            "name": "",
            "data": []
        }
        if not cleaning_history:
            room_info = Room.objects.get(id=room_id)
            resp_body["name"] = room_info.name
        else:
            resp_body["name"] = cleaning_history[0].room.name

        for cleaning_event in cleaning_history:
            resp_body["data"].append({
                "datetime": cleaning_event.datetime,
                "visits": cleaning_event.number_of_visits,
                "cleanedBy": get_users_full_name(cleaning_event.who),
                "threshold": cleaning_event.threshold,
                "comment": cleaning_event.comment
            })
        return JsonResponse(resp_body, safe=False)

    @staticmethod
    def post(request, room_id):
        room = Room.objects.get(id=room_id)
        clean_event = CleaningHistory(room=room,
                                      datetime=datetime.utcnow(),
                                      number_of_visits=room.visits / 2,
                                      threshold=room.threshold,
                                      comment=request.data['comment'],
                                      who=User.objects.get(username=request.user.username))
        room.visits = 0
        room.notification_sent = False
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
        return JsonResponse({"OK": 'True'})


@csrf_exempt
def receive_event(request, subscriber_id, eid):
    '''
    DEPRECATED
    '''
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


@csrf_exempt
def receive_event_new(request, **kwargs):
    print('123')
    # kwargs example
    # 'subscriber_id': '4b516f57-0097-4789-8cbd-45ff25ea9809', // VAS internal id
    # 'oid': '2331930e-b78c-499e-8236-cbb38c19d9a2', // oid of thing sending the event
    # 'eid': 'door_activity_cb44b166-0d3a-49cc-bcec-d88e354640bd' // event id
    if request.method == 'PUT':

        eid = None
        oid = None
        if 'eid' in kwargs:
            eid = kwargs['eid']
        if 'oid' in kwargs:
            oid = kwargs['oid']

        json_data = json.loads(request.body)
        room = Room.objects.get_or_create(door_eid=oid)

        if room[1]:
            logger.info(f"Creating default room object for new door with oid={oid}")
        else:
            logger.info(f"Adding event to existing room {room[0].name}")

        if eid == 'entry':
            state = True if json_data['event'] == 1 else False
            event = Event(time_of_event=parse_datetime(json_data['timestamp']),
                          door_state=state,
                          event_id=room[0])
        else:
            event = Event(time_of_event=parse_datetime(json_data['timestamp']),
                          door_state=json_data['value'],
                          event_id=room[0])
        room[0].visits += 1
        room[0].save()
        event.save()
        return JsonResponse({'ok': True})
    return JsonResponse({'ok': False}, status=403)
