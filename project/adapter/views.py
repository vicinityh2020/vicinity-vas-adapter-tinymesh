from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


@csrf_exempt
def thing_description(request):
    description = {
        "adapter-id": settings.ADAPTER_ID,
        "thing-descriptions": [
            {
                "oid": settings.SERVICE_ID,
                "name": "TinyMeshVAS 1",
                "type": "core:Service",
                "properties": [],
                "actions": [],
                "events": []
            }
        ]
    }
    return JsonResponse(description)