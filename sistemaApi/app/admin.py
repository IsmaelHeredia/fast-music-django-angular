from django.contrib import admin

from app.models import Playlist, Song, Station, Config

@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ['title', 'duration_string', 'fullpath', 'playlist', 'favorite']

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ['name', 'link', 'categories']

@admin.register(Config)
class ConfigAdmin(admin.ModelAdmin):
    list_display = ['song_directory']