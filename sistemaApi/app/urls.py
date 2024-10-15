from django.urls import path
from app.views.playlist import PlaylistAPIView, PlaylistDetailAPIView
from app.views.song import SongAPIView, SongDetailAPIView, SongFavDetailAPIView
from app.views.station import StationAPIView, StationDetailAPIView
from app.views.station import StationImportAPIView, StationValidateAPIView
from app.views.config import ConfigAPIView, LocalConfigSetAPIView, LocalConfigUpdateAPIView
from app.views.config import GDConfigSetAPIView, GDConfigUpdateAPIView
from app.views.auth import ValidateAPIView
from app.views.account import AccountAPIView
from app.views.scanner import ScannerAPIView
from app.views.player import PlayerAPIView
from app.views.sync import SyncGDAPIView, SyncPCAPIView, SyncStatusAPIView

urlpatterns = [
    path('playlists/', PlaylistAPIView.as_view(), name = 'playlists'),
    path('playlists/<int:pk>', PlaylistDetailAPIView.as_view(), name = 'playlists_detail'),
    
    path('songs/', SongAPIView.as_view(), name = 'songs'),
    path('songs/<int:pk>', SongDetailAPIView.as_view(), name = 'songs_detail'),
    path('songs/<int:pk>/favorite', SongFavDetailAPIView.as_view(), name = 'songs_fav_detail'),
    
    path('stations/', StationAPIView.as_view(), name = 'stations'),
    path('stations/<int:pk>', StationDetailAPIView.as_view(), name = 'stations_detail'),
    path('stations/import', StationImportAPIView.as_view(), name = 'stations_import'),
    path('stations/validate', StationValidateAPIView.as_view(), name = 'stations_validate'),
    
    path('config/', ConfigAPIView.as_view(), name = 'config_get'),
    
    path('config/local/new', LocalConfigSetAPIView.as_view(), name = 'local_config_new'),
    path('config/local/set', LocalConfigUpdateAPIView.as_view(), name = 'local_config_set'),
    
    path('config/gd/new', GDConfigSetAPIView.as_view(), name = 'gd_config_new'),
    path('config/gd/set', GDConfigUpdateAPIView.as_view(), name = 'gd_config_set'),
    
    path('validate/', ValidateAPIView.as_view(), name='validate'),
    
    path('account/', AccountAPIView.as_view(), name='account'),
    
    path('scanner/', ScannerAPIView.as_view(), name='scanner'),
    
    path('player/', PlayerAPIView.as_view(), name='player'),
    
    path('sync/gd', SyncGDAPIView.as_view(), name='sync_gd'),
    path('sync/pc', SyncPCAPIView.as_view(), name='sync_pc'),
    path('sync/<int:pk>/status', SyncStatusAPIView.as_view(), name = 'sync_status'),
]