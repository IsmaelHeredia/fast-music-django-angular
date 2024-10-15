from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status

from app.models import Station
from app.serializers import StationSerializer, ImportSerializer

from app.functions import send_success, send_warning, send_error

import json

import requests

class StationAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            stations = Station.objects.all()
            stations_serializer = StationSerializer(stations, many=True)
            data = send_success('Las estaciones fueron cargadas correctamente', stations_serializer.data)
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            serializer = StationSerializer(data = request.data)
            if serializer.is_valid():
                serializer.save()
                data = send_success('La estación fue creada correctamente', serializer.data)
                return Response(data, status = status.HTTP_200_OK)
            else:
                data = send_warning(serializer.errors)
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

class StationDetailAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk = None):
        try:
            station = Station.objects.get(pk = pk)
            station_serializer = StationSerializer(station)
            data = send_success('La estación fue cargada correctamente', station_serializer.data)
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk = None):
        try:
            station = get_object_or_404(Station, pk = pk)
            serializer = StationSerializer(station, data = request.data)
            if serializer.is_valid():
                serializer.save()
                data = send_success('La estación fue actualizada correctamente', serializer.data)
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
            station = get_object_or_404(Station, pk = pk)
            station.delete()
            data = send_success('La estación fue borrada correctamente')
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)
        
class StationImportAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = ImportSerializer(data = request.data)
            if serializer.is_valid():
                json_data = request.FILES.get('jsonfile').read()
                content = json_data.decode('utf-8')
                json_list = json.loads(content)
                for item in json_list:
                    name = item['name']
                    link = item['link']
                    categories = item['categories']
                    if not Station.objects.filter(name=name).exists():
                        s = Station.objects.create(name = name, link = link, categories = categories)
                data = send_success('El archivo fue importado correctamente', [])
                return Response(data, status = status.HTTP_200_OK)
            else:
                data = send_warning(serializer.errors)
                return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)
        
class StationValidateAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            stations = Station.objects.all()
            for station in stations:
                id = station.id
                name = station.name
                link = station.link
                try:
                    response = requests.head(link, timeout=10)
                except Exception as e:
                    print('Station ', name, ' FAIL')
                    Station.objects.filter(id=id).delete()
                if response.status_code == 200:
                    print('Station ', name, ' OK')
                else:
                    print('Station ', name, ' FAIL')
                    Station.objects.filter(id=id).delete()
                    
            data = send_success('Las estaciones fueron validadas correctamente', [])
            return Response(data, status = status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            data = send_error()
            return Response(data, status = status.HTTP_400_BAD_REQUEST)