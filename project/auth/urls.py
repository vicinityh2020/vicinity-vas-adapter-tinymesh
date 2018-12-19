from django.conf.urls import include, url
from django.contrib.auth.models import User
from rest_framework import routers, viewsets, serializers


# from .api import RegistrationAPI, LoginAPI, UserAPI
from auth.api import LoginAPI, UserAPI


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff')


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)

urlpatterns = [
    url("^", include(router.urls)),
    url("^auth/login/$", LoginAPI.as_view()),
    url("^auth/user/$", UserAPI.as_view()),
]