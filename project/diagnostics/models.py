from django.db import models
from django.db.models import F


class KPIData(models.Model):
    msg_received = models.IntegerField(default=0)
    maintenance_alerts = models.IntegerField(default=0)
    notification_count = models.IntegerField(default=0)

    @staticmethod
    def increment_notification_count():
        kpi_data, created = KPIData.objects.get_or_create(id=1)
        kpi_data.notification_count = F('notification_count') + 1

    @staticmethod
    def increment_msg_received():
        kpi_data, created = KPIData.objects.get_or_create(id=1)
        if created:
            kpi_data.msg_received = F('msg_received') + 1
        else:
            kpi_data.msg_received = F('msg_received') + 1
