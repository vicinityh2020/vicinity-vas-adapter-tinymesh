from celery import task
from django.db.models import F

from adapter.KeySMS.sms import KeySMS
from adapter.models import Room
from django.conf import settings


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
        print(f"Updated status for room: {room.name}")
    else:
        print("Something went wrong when sending notification")
        print(resp)


