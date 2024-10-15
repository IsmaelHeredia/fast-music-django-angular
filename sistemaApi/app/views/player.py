from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status

from app.models import Song
from app.serializers import PlayerSerializer

from app.functions import send_success, send_warning, send_error, generate_uuiid

import os, pathlib, shutil
        
class PlayerAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            
            serializer = PlayerSerializer(data=request.data)
            
            if serializer.is_valid():
                
                song_id = serializer.validated_data['song_id']
                
                song = Song.objects.get(pk = song_id)
                
                fullpath = song.fullpath
                
                print(fullpath)
                
                current_dir = os.path.abspath(os.path.dirname(__file__))
                
                static_folder = str(pathlib.Path(current_dir).parent) + "/static"
                
                files = os.listdir(static_folder)

                for file in files:
                    if file.endswith(".mp3"):
                        os.remove(os.path.join(static_folder, file))
                
                print(static_folder)
                
                new_name = generate_uuiid(5) + ".mp3"
                
                static_song = static_folder + "/" + new_name
                
                print(static_song)
                
                shutil.copyfile(fullpath, static_song)
                
                res = {
                    "nombre_archivo": new_name,
                    "titulo" : song.title,
                    "favorito": song.favorite
                }
                                                
                data = send_success('La canción se envío correctamente', res)
                
                return Response(data, status = status.HTTP_200_OK)
            
            else:
                data = send_warning(serializer.errors)
                
                return Response(data, status = status.HTTP_200_OK)
        
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)