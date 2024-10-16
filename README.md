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

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0hEFgToCTUJ5wzZjC2BtHhOAKSq7ndcunhZ47M3oyZ4B68uKKYu13BiOSlw_Uycj_Cm6cXfU0ChrMvGZq7AzOooKz3ZTQHsYQlSckLNSo5uZERyl6_UwG_LlBOeUmOM0CdMsTdetzehDLRM1zOjZ1hahq1Ljsz5Bv37ybqIfAqsmby7jRd0UlQXC_2wc/s1841/1.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgc8gHKfmolHzXwRvEx9qbdaoKAYWPIyP3b26oOSjhKYx7hqwutKkikVSdIt5v3Og4EnevxaywQyegetwEQHB3hrOHMCyV8li1hhAGhmDLDLkdYRrQajdX72V1NU3ohyphenhyphenOgDteBUMztBraRmVhqQsYnMFMqK7c4-s4Kc5h1MhJoNGXXkBiM14wItMiBrVXY/s1841/2.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgqwBZPAqLcy2nNmGp8DHuyAlMmO76aic1dhYnDWm7kzJh944BIL0kB13e8EwwNT0ncBhZWqEFPOqpWGBNNhmyx1XbJrMjX2QVvbRW8bTlr9gBhsHxdNrBlwU3uhnQiZhbPwtuiRFuAHw__4Jw37sjnrNldbFmPd_al6Y0IxIYP2YKZ1ArEHNks9CEcUdc/s1862/3.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipx7kKE5tPEQBmNUkb6qK4C-Fl0BX7qwrbhtWdsAW9bnynhi2zSiCmme5cVWxqqLqiAFwWg1xbhmwD4lTtbL6xoqRrmbjf0_QBjWYkEertIrdfj_28GnwEqcEVQalN8f8p5qOW9e2PG95Be0oXqtijfjj9nX_gbmjJYTPhtncpJ5INoNpaeQUBH5Eq-sQ/s1862/4.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvpLhaFO5L_Mvf3fJ3OJKkT7aLXH30FyJL7jYaByl5PkkyL42A-bNlWUwYJ4madT1sHPVgxwzBMJ1OEd8PpHADSmPG8SXhGGyCzbI11Qv4vYYfeC51bSMwq4XvvkTQRnQBKciMCE6ck_LWGf2aG5EvYnWYFM3mRVOlv_XrzpipzmMeoax_nESnYz091Gg/s1862/5.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhi1LD944MJ54oHmHZVVtco0SYeycdeAUsgEVxsV1JVyC11oah_AXt_lc8Bi5MKQWNJ0BDowF8wolyicyCSUOp16ibtPEMnJjkS44YK2fJdcHXE_9izG-4jJTHU6Z4iPNeISgNXSPhVlvawt2GRM86LgDrQ405_dAuJN8eiOnZzvnwJA3yfF2KYBvQlbGQ/s1862/6.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjt9vVusU5pxlSAuNYqJzkdAG9eCJV-TdTNsZQMFMYipCaWBbLKd5h095pwoeDwQP97V7aBXffYypPSSL1M7HSz54fEqoFrmAa7OdYv6ZnPSMOuwaQZ9eId25ABXlfLD9RA0AIpx8ACQzICi5yTPctGXlq2MfX2NXMZgzFGGzwNwe8OalmaPY0VBNmC_Sc/s1862/7.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEie6wVrTjcCXijzXmVgkusCWeo6bj-MajoUR63LGKwFQFTFGIy-iNV-6JW0m83Jrk3w1nC727I0_yy9zMsfKADAOn7mM3Y2DiZjhFVGPILC1DljIbCyXevhjpRYusyc-qXo7zCfJIvCnjga4CfFDsK4EY0h-E9SKIsOqXomoaUeBUHCygP3IYXkP3mM-rw/s1862/8.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgpS8m5yvZIF0H7ZLAioumyT2TEhoJCD9ZsBNj2bLJhq_SODfdnSgXtUCzw2w9-0RnWaOkc2rqhM5oQzeyOcuA4mAeNL0xy_3O-Pms4JcUxkSHml4JHGrsexqDcD2cLdUpKJIlouQ7DgdF0ZOdydwR6NIahuycpTkf_AEpKaKhlG37bdAddBBg0dzogIYQ/s1862/9.png)

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