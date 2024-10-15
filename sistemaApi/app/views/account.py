from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status

from django.contrib.auth.models import User
from app.serializers import AccountSerializer

from app.functions import send_success, send_warning

class AccountAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        serializer = AccountSerializer(data=request.data)
                
        if serializer.is_valid():
        
            username = serializer.validated_data['username']
            new_username = serializer.validated_data['new_username']        
            password = serializer.validated_data['password']
            new_password = serializer.validated_data['new_password']
            
            is_already_exists = User.objects.filter(username = username).exists()
            
            if is_already_exists:
                        
                user = User.objects.get(username=username)
                            
                if user.check_password(password):
                                
                    user.username = new_username
                    user.set_password(new_password)
                    
                    user.save()
                                                            
                    data = send_success('Los datos de la cuenta se actualizaron correctamente')
                    
                    return Response(data, status = status.HTTP_200_OK)
        
                else:                    
                    data = send_warning('La clave is incorrecta')
                    
                    return Response(data, status = status.HTTP_200_OK)
            else:
                                                
                data = send_warning('El usuario no existe')
                
                return Response(data, status = status.HTTP_200_OK)
        
        else:
                        
            data = send_warning(serializer.errors)
            
            return Response(data, status = status.HTTP_200_OK)