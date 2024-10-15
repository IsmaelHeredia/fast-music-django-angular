from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status

from app.models import Song, Playlist, Config
from app.serializers import Song, Playlist

from app.functions import send_success, send_warning, send_error
from app.functions import convert_to_duration

from stat import S_ISREG, ST_CTIME, ST_MODE
import os, sys, time

from mutagen.mp3 import MP3
        
class ScannerAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        sync_folder = None
                
        try:
            config = Config.objects.get(pk = 1)
            sync_folder = config.song_directory
            if sync_folder is None:
                data = send_warning('Falta configurar el directorio de escaneo')
                return Response(data, status = status.HTTP_200_OK)                
        except Config.DoesNotExist:
                data = send_warning('Falta configurar el directorio de escaneo')
                return Response(data, status = status.HTTP_200_OK)
            
        folders = []
        
        for list_name in os.listdir(sync_folder):
            list_path = os.path.join(sync_folder, list_name)
            if os.path.isdir(list_path):
                folders.append(list_name)
            
        # Se borran las playlists que no existen en la carpeta de escaneo pero si en la BD
        
        playlists_folder = Playlist.objects.all()
        
        for playlist_folder in playlists_folder:
            
            id = playlist_folder.id
            nombre_carpeta = playlist_folder.name
                        
            if nombre_carpeta not in folders:                
                Song.objects.filter(playlist_id=id).delete()
                Playlist.objects.filter(id=id).delete()
                #print('se borro playlist ', nombre_carpeta)
        
        # Se borran las canciones que no existen en la carpeta de escaneo pero si en la BD
                
        songs_folder = Song.objects.all()
                        
        for song_folder in songs_folder:
            fullpath = song_folder.fullpath
            if not os.path.isfile(fullpath):
                #print("se borro cancion ", fullpath)
                Song.objects.filter(fullpath=fullpath).delete()
                        
        # Comienza escaneo de nuevas canciones y playlists
        
        try:
                                                                        
            for folder in folders:
                
                #Verificar si existe o no en la BD
                
                playlist_id = None
                
                if not Playlist.objects.filter(name=folder).exists():
                    p = Playlist.objects.create(name = folder)
                    playlist_id = p.pk
                else:
                    p = Playlist.objects.filter(name=folder).first()
                    playlist_id = p.id
                
                folder_path = sync_folder + "/" + folder

                entries = (os.path.join(folder_path, fn) for fn in os.listdir(folder_path))
                entries = ((os.stat(path), path) for path in entries)

                entries = ((stat[ST_CTIME], path)
                        for stat, path in entries if S_ISREG(stat[ST_MODE]))
                        
                for cdate, path in sorted(entries):
                    if path.endswith(".mp3"):
                        audio = MP3(path)
                        duration_string = convert_to_duration(audio.info.length)
                        name, ext = os.path.splitext(os.path.basename(path))
                                            
                        # Verifica si ya existe la cancion
                        
                        if not Song.objects.filter(fullpath=path).exists():
                        
                            s = Song.objects.create(
                                title = name,
                                duration_string = duration_string,
                                fullpath = path,
                                favorite = 0,
                                playlist_id = playlist_id
                            )
                        
            data = send_success('El scanner se ejecuto correctamente', [])
            
            return Response(data, status = status.HTTP_200_OK)
        
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)