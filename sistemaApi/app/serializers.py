from rest_framework import serializers 
from app.models import Playlist, Song, Station, Config, SyncLog
 
class PlaylistSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Playlist
        fields = ('id', 'name', 'created_at', 'updated_at')

class SongSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Song
        fields = ('id', 'title', 'duration_string', 'fullpath', 'playlist', 'favorite', 'created_at', 'updated_at')

class StationSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Station
        fields = ('id', 'name', 'link', 'categories', 'created_at', 'updated_at')

class ConfigSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Config
        fields = ('id','song_directory', 'song_directory_gd')

class SyncLogSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = SyncLog
        fields = ('id', 'logs', 'status', 'created_at', 'updated_at')

class LocalConfigSerializer(serializers.Serializer):
    song_directory = serializers.CharField(required=True)

class GDConfigSerializer(serializers.Serializer):
    song_directory_gd = serializers.CharField(required=True)

class ValidateSerializer(serializers.Serializer):
    serializers.Field
    token = serializers.CharField(required=True)
    
class AccountSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    new_username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
class PlayerSerializer(serializers.Serializer):
    song_id = serializers.CharField(required=True)
    
class FavoriteSerializer(serializers.Serializer):
    favorite = serializers.IntegerField(required=True)
    
class ImportSerializer(serializers.Serializer):
    jsonfile = serializers.FileField(required=True)