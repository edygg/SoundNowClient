SoundNow Client Node
====================

SoundNow Client Node está elaborado en Node.js junto con el framework [Express.js](http://expressjs.com/). Es el complemento del [SoundNow Server Node](https://github.com/efgm1024/SoundNowServer), este tipo de nodo puede ser replicado tantas veces como se desee. Es el encargado de almacenar las canciones subidas por el usuario de SoundNow, se recomienda entonces que el espacio y velocidad del disco duro así como el ancho de banda de la instancia donde se ejecute sean de altas prestaciones.

Tabla de contenidos
-------------------
1. [Arquitectura](#arquitectura)
2. [Requerimientos](#software-requerido)
3. [Deploy automático](#deploy-automático-del-repositorio-en-los-soundnow-client-nodes)

## Arquitectura
![](http://res.cloudinary.com/dodpsiyv0/image/upload/v1446616891/soundnowarchitecture_z1hn19.png)
Como se mencionó, el sistema de SoundNow consta de dos tipos de nodos, master y client, los cuales juegan diferentes papeles al atender las solicitudes de los clientes de la aplicación. En concreto, la arquitectura que se utilizó fue un SoundNow Master Node y tres SoundNow Client Node para balancer la carga entre ellos.

## Software requerido
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

El script de bash contenido en el archivo ```post-receive``` es el siguiente:
```bash
#!/bin/bash
while read oldrev newrev ref
do
    # Referencia importante 1
    if [[ $ref =~ .*/master$ ]];
    then
        echo "Master ref received.  Deploying master branch to production..."
        # Referencia importante 2
        git --work-tree=/root/server --git-dir=/root/SoundNowClient checkout -f
    else
        echo "Ref $ref successfully received.  Doing nothing: only the master branch may be deployed on this server."
    fi
done
```

Explicando el script anterior, busque los comentarios que mencionan ```# Referencia importante NUMERO```. En la ``` # Referencia importante 1``` se valida que la rama que sea enviada al servidor sea siempre ```master``` (Se toma en cuenta que lo que está en la rama ```master``` es código probado y listo para producción). En la ```# Referencia importante 2 ``` el comando ```git``` tiene dos opciones diferentes ```--work-tree=/root/server ``` que es la carpeta que se creó anteriormente para almacenar los archivos del repositorio y donde se alojará el script de server de Node.js, la segunda opción, ```--git-dir=/root/SoundNowClient checkout -f``` se hace sobre el directorio que continen el bare repository que se creó en pasos anteriores.

Después de crear el archivo post-receive, se le da permisos de ejecución al script con el siguiente comando
```
root:~/SoundNowClient/hooks chmod +x post-receive
```

### Configuración del servidor de producción en los clientes de desarrollo
Teniendo un repositorio de git inicializado con el código elaborado en Node.js de SoundNow se procedió a agregar una rama remota de la siguiente manera:
```
git remote add production root@server_domain_or_IP:SoundNowClient
```
Donde ```server_domain_or_IP``` es la dirección IP de Marine1 (revise el apartado de arquitectura). Para añadir a Marine2 y Marine3 al momento de hacer push al remote production haga deploy en los tres a la vez se necesita agregar las siguientes lineas:
```
git remote set-url production --push --add root@server_domain_or_IP:SoundNowClient
git remote set-url production --push --add root@server_domain_or_IP:SoundNowClient
``` 

Para finalizar envíe los cambios a los servidores con el siguiente comando:
```
git push production master
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
- Jose Mario López [![][GithubIcon]](https://github.com)
