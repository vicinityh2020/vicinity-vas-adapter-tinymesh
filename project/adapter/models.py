from django.contrib.auth.models import User
from django.db import models


class Room(models.Model):
    name = models.CharField(max_length=50, default="Unknown room")
    door_eid = models.CharField(max_length=100, unique=True)
    threshold = models.IntegerField(default=50)
    visits = models.IntegerField(default=0)
    notification_sent = models.BooleanField(default=False)
    notification_phone_number = models.CharField(max_length=8)

    def set_notification_status(self, state):
        self.notification_sent = state

    def __str__(self):
        return self.name


# Create your models here.
class Event(models.Model):
    door_state = models.BooleanField()
    time_of_event = models.DateTimeField()
    event_id = models.ForeignKey(Room, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-time_of_event']

    def get_door_state(self):
        if self.door_state:
            return 'Closed'
        else:
            return 'Opened'
    get_door_state.short_description = 'Door State'

    def __str__(self):
        if self.door_state:
            return 'Closed at: ' + str(self.time_of_event)
        else:
            return 'Opened at: ' + str(self.time_of_event)


class CleaningHistory(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    number_of_visits = models.IntegerField()
    threshold = models.IntegerField()
    who = models.ForeignKey(User, on_delete=models.CASCADE)


def get_users_full_name(user):
    if user.first_name == '' and user.last_name == '':
        return user.username
    else:
        return "{first_name} {last_name}".format(first_name=user.first_name, last_name=user.last_name)
