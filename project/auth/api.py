from knox.models import AuthToken
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from .serializers import UserSerializer, LoginUserSerializer


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        is_valid = serializer.is_valid()
        if is_valid:
            user = serializer.validated_data
            return Response({
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)
            })
        else:
            return Response({
                "error": "Wrong username or password"
            })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
