from django.db import models

class Playlist(models.Model):
    name = models.CharField(max_length = 180)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Song(models.Model):
    title = models.CharField(max_length = 180)
    duration_string = models.CharField(max_length = 180)
    fullpath = models.TextField()
    playlist = models.ForeignKey(Playlist,on_delete=models.CASCADE,default=0,db_constraint=False)
    favorite = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Station(models.Model):
    name = models.CharField(max_length = 180)
    link = models.TextField()
    categories = models.CharField(max_length = 180)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Config(models.Model):
    song_directory = models.TextField(default=None, blank=True, null=True)
    song_directory_gd = models.TextField(default=None, blank=True, null=True)

    def __str__(self):
        return self.song_directory
    
class SyncLog(models.Model):
    logs = models.TextField()
    status = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.status