# Generated by Django 2.1.5 on 2019-06-25 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='KPIData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('msg_received', models.IntegerField(null=True)),
                ('maintenance_alerts', models.IntegerField(null=True)),
                ('notification_count', models.IntegerField(null=True)),
            ],
        ),
    ]