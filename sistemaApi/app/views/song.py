from collections import Counter
import json
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status

from app.models import Song, Playlist
from app.serializers import SongSerializer, FavoriteSerializer

from app.functions import send_success, send_warning, send_error

from django.db.models import Count

class SongAPIView(APIView):
    
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            
            playlists_result = []
                        
            # Se crea un playlist nueva llamada Favoritos al inicio de la lista
            
            songs_favorites = []
            
            songs_list = Song.objects.filter(favorite = 1).order_by('-updated_at')
                        
            songs_result = []
            
            for song_item in songs_list:
                                
                data = {
                    'id': song_item.id,
                    'title': song_item.title,
                    'duration_string': song_item.duration_string,
                    'fullpath': song_item.fullpath,
                    'favorite': song_item.favorite
                }
                                
                songs_result.append(data)
                
            if len(songs_result) > 0:
                playlists_result.append({
                    'id' : None,
                    'name': 'Favoritos',
                    'songs' : songs_result
                })
                        
            # Se crea listado completo de todas las canciones en la base de datos
            
            playlists = Playlist.objects.all().order_by('name')
            
            for playlist in playlists:
                
                songs_result = []
                
                songs = Song.objects.filter(playlist_id = playlist.id).order_by('-updated_at')
                
                for song in songs:
                    
                    data = {
                        'id': song.id,
                        'title': song.title,
                        'duration_string': song.duration_string,
                        'fullpath': song.fullpath,
                        'favorite': song.favorite
                    }
                    
                    songs_result.append(data)
                    
                    if(data['favorite'] == 1):
                        songs_favorites.append(data)
                    
                playlists_result.append({
                    'id' : playlist.id,
                    'name': playlist.name,
                    'songs' : songs_result
                })
                
            playlists_count = Playlist.objects.annotate(songs_count=Count('song')).order_by('-songs_count')[:10]
            
            playlists_most_songs = []
            
            for playlist in playlists_count:
                playlists_most_songs.append({
                    'id': playlist.id,
                    'name': playlist.name,
                    'songs_count': playlist.songs_count 
                })
                                   
            playlists_sort = {}                 
            
            for playlist in playlists_result:
                nombre = playlist['name']
                if nombre != 'Favoritos':
                    canciones = playlist['songs']
                    favoritos = 0
                    for cancion in canciones:
                        es_favorito = cancion['favorite']
                        if es_favorito == 1:
                            favoritos += 1
                    if favoritos != 0:
                        playlists_sort[nombre] = favoritos
                                
            playlists_order = sorted(playlists_sort, key=playlists_sort.get, reverse=True)
            
            playlists_most_favorites = []
            
            for playlist in playlists_order:
                pl = Playlist.objects.get(name=playlist)
                playlists_most_favorites.append({
                    'id': pl.id,
                    'name': playlist,
                    'songs_count': playlists_sort[playlist]
                })
                
            '''
            print('### Mas cantidad ###')
            
            for playlist in playlists_most_songs:
                print(playlist)
            
            print('### Mas favoritos ###')
            
            for playlist in playlists_most_favorites:
                print(playlist)
            '''
                
            ##print('### Carpeta final ###')
            
            limit = 10
            
            if len(playlists_most_favorites) < limit:
                find_more = 10 - len(playlists_most_favorites)
                counter = 0
                for playlist in playlists_most_songs:
                    if not any(d['name'] == playlist['name'] for d in playlists_most_favorites):
                        playlists_most_favorites.append(playlist)
                        counter += 1
                        if(find_more == counter):
                            break
                            
            result = {}
            result['playlists'] = playlists_result
            result['playlists_most_used'] = playlists_most_favorites
            result['playlists_favorites'] = songs_favorites
                                            
            data = send_success('Las canciones fueron cargadas correctamente', result)
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            serializer = SongSerializer(data = request.data)
            if serializer.is_valid():
                serializer.save()
                data = send_success('La canción fue creada correctamente', serializer.data)
                return Response(data, status = status.HTTP_200_OK)
            else:
                data = {
                    'estado': 0,
                    'mensaje': serializer.errors
                }
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

class SongDetailAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk = None):
        try:
            song = Song.objects.get(pk = pk)
            song_serializer = SongSerializer(song)
            data = send_success('La playlist fue cargada correctamente', song_serializer.data)
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk = None):
        try:
            song = get_object_or_404(Song, pk = pk)
            serializer = SongSerializer(song, data = request.data)
            if serializer.is_valid():
                serializer.save()
                data = send_success('La canción fue actualizada correctamente', serializer.data)
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
            song = get_object_or_404(Song, pk = pk)
            song.delete()
            data = send_success('La canción fue borrada correctamente')
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)
        

class SongFavDetailAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk = None):
        try:
            serializer = FavoriteSerializer(data = request.data)
            if serializer.is_valid():
                song = get_object_or_404(Song, pk = pk)
                song.favorite = serializer.validated_data['favorite']
                song.save()
                data = send_success('La asignación de favorito se registro correctamente', serializer.data)
                return Response(data, status = status.HTTP_200_OK)
            else:
                data = send_warning(serializer.errors)
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)