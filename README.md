# Fast Music

En este proyecto se hizo un completo reproductor de música, las tecnologías que usa son Django como Backend y Angular como Frontend, la base de datos que usa es MySQL.

Las funciones incorporadas son :

Inicio de sesión obligatorio para usar el sistema protegido con JWT.

Posibilidad de cambiar usuario y contraseña.

Posibilidad de cambiar el theme completo del sistema a un modo oscuro o claro.

Se puede sincronizar una carpeta de Google Drive con la carpeta local del sistema donde se guardara toda la música, también se puede hacer el efecto contrario, que seria sincronizar la carpeta local del sistema con la carpeta de Google Drive.

Incorpora un escaneo de carpeta local donde se deben registrar todas las canciones guardadas cada una en su playlist o carpeta correspondiente.

En el reproductor de música se puede filtrar por playlists que serán guardadas en Redux, lo mismo seria para filtrar por nombre de canción. Ademas se pueden fijar canciones como favoritas lo que hará que se cree una playlist aparte al principio de la lista para poder localizar de una forma mas eficiente.

También incorpora un reproductor de estaciones o streams, en esa sección se pueden registrar, editar y borrar estaciones, para mayor comodidad incorpora un buscador por nombre que usa Redux. Ademas contiene las funciones de importar las estaciones en formato json, exportar las estaciones para descargar en formato json y la función de validar todas las estaciones para verificar su correcto funcionamiento y borrarlas en caso de no estén funcionando.

A continuación se muestran unas imágenes del sistema en funcionamiento.

![screenshot]()

Para la correcta instalación del sistema se deben seguir los siguiente pasos. 

En la carpeta del Backend que sería "sistemaApi" se debe renombrar el archivo .env.example a solo .env y editar la configuración con los datos de tu conexión MySQL. También se debe editar el SECRET_KEY con tu propia clave, se puede generar una con el siguiente comando : 

```
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

Después se tienen que crear las credenciales para el servicio "Google Drive API" en la URL https://console.cloud.google.com, una vez creado todo se descargan las credenciales y se guardan en el mismo directorio del archivo manage.py con el nombre de client_secrets.json.

Una vez terminado todo se deben seguir estos pasos :

Para instalar las dependencias de Django : 

```
pip install django djangorestframework djangorestframework_simplejwt
```
```
sudo apt install pkg-config
```
```
sudo apt-get install gcc libmysqlclient-dev python3-dev
```
```
pip install mysqlclient
```
```
pip install django-cors-headers
```
```
pip install python-dotenv
```

Para instalar el modulo necesario para sincronizar con Google Drive : 

```
pip install PyDrive
```

Para realizar las migraciones de Django : 

```
python3 manage.py makemigrations
```
```
python3 manage.py migrate
```

Para crear el usuario por defecto : 

```
python3 manage.py createsuperuser
```

Finalmente para iniciar el servidor se debe ejecutar este comando : 

```
python3 manage.py runserver 7777
```

En la carpeta del Frontend que sería "sistemaFrontend" se debe ejecutar el siguiente comando para instalar las dependencias : 

```
npm install
```

En esa misma carpeta deben ir al directorio "environments" para modificar los archivos environment.ts reemplazando las variables "apiUrl" y "filesUrl" por la ruta de su servidor Backend.

Finalmente para iniciar el servidor se debe ejecutar este comando : 

```
npm run start
```