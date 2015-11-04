SoundNow Client Node
====================

SoundNow Client Node está elaborado en Node.js junto con el framework [Express.js](http://expressjs.com/). Es el complemento del [SoundNow Server Node](https://github.com/efgm1024/SoundNowServer), este tipo de nodo puede ser replicado tantas veces como se desee. Es el encargado de almacenar las canciones subidas por el usuario de SoundNow, se recomienda entonces que el espacio y velocidad del disco duro así como el ancho de banda de la instancia donde se ejecute sean de altas prestaciones.

Tabla de contenidos
-------------------
1. [Arquitectura](#arquitectura)

## Arquitectura
![](http://res.cloudinary.com/dodpsiyv0/image/upload/v1446616891/soundnowarchitecture_z1hn19.png)
Como se mencionó, el sistema de SoundNow consta de dos tipos de nodos, master y client, los cuales juegan diferentes papeles al atender las solicitudes de los clientes de la aplicación. En concreto, la arquitectura que se utilizó fue un SoundNow Master Node y tres SoundNow Client Node para balancer la carga entre ellos.

## Requerimientos necesarios
1. [Node.js](https://nodejs.org/en/)
2. [Grunt.js](http://gruntjs.com/)
3. [Forever Node.js Scripts Runner](http://www.slidequest.com/q/70ang)

## Deploy automático del repositorio en los SoundNow Client Nodes
En esta sección se explicará la mejor manera de actualizar un servidor de producción. Se usó un modelo push-to-deploy en vías de actualizar nuestro web server sobre un bare repository de git.

### Instalar y configurar un Post-Receive Hook en el servidor de producción
En el servidor de producción se creó una carpeta para alojar todo el código de la aplicación en la ruta ```/root/server/```.

```
  root:~ $ mkdir server
```

Asegurar de que el directorio le pertenece al usuario con el siguiente comando

```
  sudo chown -R `root`:`id -gn` /root/server/
```

Luego, se creó otro directorio en la carpeta home del user root denominada ```SoundNowClient```. Un bare repository de git fue inicializado en esa carpeta:
```
root:~ $ mkdir SoundNowClient
root:~ $ cd SoundNowClient
root:~/SoundNowClient $ git init --bare
```

Un bare repository coloca en la carpeta actual todos los directorios que convencionalmente estarían en el directorio ```.git```.

Se necesitó crear un nuevo git hook. Esta vez estamos interesados en el evento ```post-receive```, el cual se ejecuta en el servidor de producción cuando se recibe un git push. ejecute los siguientes comando para crear el archivo:
```
root:~/SoundNowClient $ cd hooks
root:~/SoundNowClient/hooks $ vim post-receive
```
## Instalación y verificación de correcto funcionamiento

***********************************
[GithubIcon]: https://assets-cdn.github.com/favicon.ico

Desarrollado por:
- Laurenn Alecxandra Cruz [![][GithubIcon]](https://github.com/Alecxandra)
- Edilson Fernando Gonzalez [![][GithubIcon]](https://github.com/efgm1024)
- Carlos Arturo Banegas [![][GithubIcon]](https://github.com/efgm1024)
- Cesar Emmanuel Welchez [![][GithubIcon]](https://github.com)
- Jorge Alejandro Caballero [![][GithubIcon]](https://github.com)
- Jose Mario López
[![][GithubIcon]](https://github.com)
