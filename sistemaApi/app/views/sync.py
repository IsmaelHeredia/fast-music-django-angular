from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status

from app.functions import send_success, send_warning, send_error

from app.models import Config, SyncLog
from app.serializers import SyncLogSerializer

import os

import subprocess

class SyncGDAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        try:
            config = Config.objects.get(pk = 1)
            song_directory_gd = config.song_directory_gd
            if song_directory_gd is None:
                data = send_warning('Falta configurar la carpata de sincronización')
                return Response(data, status = status.HTTP_200_OK)                
        except Config.DoesNotExist:
                data = send_warning('Falta configurar la carpata de sincronización')
                return Response(data, status = status.HTTP_200_OK)
        
        try:
            directory_base = os.path.dirname(os.path.dirname(__file__))
            directory = "/".join(list(directory_base.split('/')[0:-1])) 
            
            
            s = SyncLog.objects.create(logs = "Se inicio la sincronización por Google Drive", status = 0)
            sync_id = str(s.pk)
                        
            subprocess.Popen(["python3","sync.py","-sync-from-drive","-id-sync",sync_id], cwd = directory)
            
            dataResponse = {
                'sync_id' : s.pk
            }
            
            data = send_success('La sincronización con Google Drive se ejecuto correctamente', dataResponse)
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)
        
        
class SyncPCAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        try:
            config = Config.objects.get(pk = 1)
            song_directory_gd = config.song_directory_gd
            if song_directory_gd is None:
                data = send_warning('Falta configurar la carpata de sincronización')
                return Response(data, status = status.HTTP_200_OK)                
        except Config.DoesNotExist:
                data = send_warning('Falta configurar la carpata de sincronización')
                return Response(data, status = status.HTTP_200_OK)
        
        try:
            directory_base = os.path.dirname(os.path.dirname(__file__))
            directory = "/".join(list(directory_base.split('/')[0:-1])) 
            
            
            s = SyncLog.objects.create(logs = "Se inicio la sincronización por PC", status = 0)
            sync_id = str(s.pk)
                        
            subprocess.Popen(["python3","sync.py","-sync-from-pc","-id-sync",sync_id], cwd = directory)
            
            dataResponse = {
                'sync_id' : s.pk
            }
            
            data = send_success('La sincronización local se ejecuto correctamente', dataResponse)
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)
        
class SyncStatusAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk = None):
        try:
            syncLog = SyncLog.objects.get(pk = pk)
            synclog_serializer = SyncLogSerializer(syncLog)
            data = send_success('Los datos de sincronización fueron enviados correctamente', synclog_serializer.data)
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)