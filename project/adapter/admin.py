from django.contrib import admin

from adapter.models import Event, Room, CleaningHistory


class EventAdmin(admin.ModelAdmin):
    list_display = ('get_door_state', 'time_of_event')


class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'door_eid', 'threshold')


class CleaningHistoryAdmin(admin.ModelAdmin):
    list_display = [field.name for field in CleaningHistory._meta.get_fields()]


admin.site.register(CleaningHistory, CleaningHistoryAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Room, RoomAdmin)
