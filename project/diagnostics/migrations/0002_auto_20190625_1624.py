# Generated by Django 2.1.5 on 2019-06-25 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diagnostics', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='kpidata',
            name='maintenance_alerts',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='kpidata',
            name='msg_received',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='kpidata',
            name='notification_count',
            field=models.IntegerField(default=0),
        ),
    ]