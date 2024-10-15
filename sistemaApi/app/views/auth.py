from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User

from app.serializers import ValidateSerializer

from app.functions import send_success, send_warning, send_error

import jwt

import os

from dotenv import load_dotenv
load_dotenv()

class ValidateAPIView(APIView):

    def post(self, request):
        
        serializer = ValidateSerializer(data=request.data)
                        
        if serializer.is_valid():
                        
            token = serializer.validated_data['token']
                                            
            try:
                
                result = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=["HS256"])
                user_id = result['user_id']
                
                user = User.objects.get(pk = user_id)
                username = user.username
                
                result['username'] = username
                                
                data = send_success('Token validado', result)
                
                return Response(data, status = status.HTTP_200_OK)
            
            except Exception as e:
                                
                data = send_warning('El token no es valido')
                
                return Response(data, status = status.HTTP_200_OK)
        else:
                                    
            data = send_warning(serializer.errors)
            
            return Response(data, status = status.HTTP_200_OK)