import datetime
import json
from email.utils import formatdate

import requests
from celery import task
from django.db import transaction, IntegrityError
from django.db.models import F

from adapter.KeySMS.sms import KeySMS
from adapter.models import Room
from django.conf import settings

from diagnostics.models import KPIData


@task()
def room_check():
    uncleaned_rooms = Room.objects.filter(visits__gt=F("threshold"), notification_sent=False)

    print(settings.KEYSMS_LOGIN, settings.KEYSMS_API_KEY)
    if not uncleaned_rooms:
        print("No uncleaned rooms, or notification was already sent out")
        return

    sms = KeySMS()
    sms.auth(settings.KEYSMS_LOGIN, settings.KEYSMS_API_KEY)

    for room in uncleaned_rooms:
        send_notification(room, sms)


def send_notification(room, sms):
    message_text = f"Room: {room.name} has been visited {room.visits} times and needs cleaning"
    phone_num = room.notification_phone_number
    resp = sms.sms(message_text, [phone_num, ])
    if resp['ok']:
        print("Message sent successfully")
        room.set_notification_status(True)
        room.save()

        KPIData.increment_notification_count()

        print(f"Updated status for room: {room.name}")
    else:
        print("Something went wrong when sending notification")
        print(resp)


@task()
def send_KPI():
    try:
        with transaction.atomic():
            kpi_data = KPIData.objects.all().first()
            number_of_events = kpi_data.msg_received

            kpi_data.msg_received = 0
            kpi_data.save()
    except IntegrityError:
        print("Integrity error when fetching data from DB")
        return


    key = settings.DASHBOARD_KEY
    url = "https://cpsgw.cs.uni-kl.de/vicinity-dashboard/Data/Oslo"
    payload = {
        "timestamp": formatdate(),
        "graph_id": "NumMsgReceived",
        "dat_value": number_of_events
    }

    requests.post(url, json.dumps(payload), headers={"Content-Type": "application/json", "AUTH": key})
