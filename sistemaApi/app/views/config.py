from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status

from app.models import Config
from app.serializers import ConfigSerializer, LocalConfigSerializer, GDConfigSerializer

from app.functions import send_success, send_warning, send_error

class ConfigAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            config = Config.objects.get(pk = 1)
            config_serializer = ConfigSerializer(config)
            data = send_success('La configuración se actualizo correctamente', config_serializer.data)
            return Response(data, status = status.HTTP_200_OK)
        except Config.DoesNotExist:
                data = send_warning('Falta configurar el directorio de escaneo')
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

class LocalConfigSetAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = LocalConfigSerializer(data = request.data)
            if serializer.is_valid():
                song_directory = serializer.validated_data['song_directory']
                Config.objects.create(song_directory = song_directory)
                data = send_success('Los cambios se ejecutaron correctamente', serializer.data)
                return Response(data, status = status.HTTP_200_OK)
            else:
                data = send_warning(serializer.errors)
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)
        
class LocalConfigUpdateAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            config = get_object_or_404(Config, pk = 1)
            serializer = LocalConfigSerializer(config, data = request.data)
            if serializer.is_valid():
                song_directory = serializer.validated_data['song_directory']
                config.song_directory = song_directory
                config.save()
                data = send_success('Los cambios se ejecutaron correctamente', serializer.data)
                return Response(data, status = status.HTTP_200_OK)
            else:
                data = send_warning(serializer.errors)
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)
        
class GDConfigSetAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = GDConfigSerializer(data = request.data)
            if serializer.is_valid():
                song_directory_gd = serializer.validated_data['song_directory_gd']
                Config.objects.create(song_directory_gd = song_directory_gd)
                data = send_success('Los cambios se ejecutaron correctamente', serializer.data)
                return Response(data, status = status.HTTP_200_OK)
            else:
                data = send_warning(serializer.errors)
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)
        
class GDConfigUpdateAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            config = get_object_or_404(Config, pk = 1)
            serializer = GDConfigSerializer(config, data = request.data)
            if serializer.is_valid():
                song_directory_gd = serializer.validated_data['song_directory_gd']
                config.song_directory_gd = song_directory_gd
                config.save()
                data = send_success('Los cambios se ejecutaron correctamente', serializer.data)
                return Response(data, status = status.HTTP_200_OK)
            else:
                data = send_warning(serializer.errors)
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)