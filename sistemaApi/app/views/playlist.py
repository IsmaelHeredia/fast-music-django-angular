from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status

from app.models import Playlist
from app.serializers import PlaylistSerializer

from app.functions import send_success, send_warning, send_error

class PlaylistAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            playlists = Playlist.objects.all()
            playlists_serializer = PlaylistSerializer(playlists, many=True)
            data = send_success('Las playlists fueron cargadas correctamente', playlists_serializer.data)
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            serializer = PlaylistSerializer(data = request.data)
            if serializer.is_valid():
                serializer.save()
                data = send_success('La playlist fue creada correctamente', serializer.data)
                return Response(data, status = status.HTTP_200_OK)
            else:
                data = send_warning(serializer.errors)
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)


class PlaylistDetailAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk = None):
        try:
            playlist = Playlist.objects.get(pk = pk)
            playlist_serializer = PlaylistSerializer(playlist)
            data = send_success('La playlist fue cargada correctamente', playlist_serializer.data)
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk = None):
        try:
            playlist = get_object_or_404(Playlist, pk = pk)
            serializer = PlaylistSerializer(playlist, data = request.data)
            if serializer.is_valid():
                serializer.save()
                data = send_success('La playlist fue actualizada correctamente', serializer.data)
                return Response(data, status = status.HTTP_200_OK)
            else:
                data = send_warning(serializer.errors)
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)
            
    def delete(self, request, pk = None):
        try:
            playlist = get_object_or_404(Playlist, pk = pk)
            playlist.delete()
            data = send_success('La playlist fue borrada correctamente')
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)