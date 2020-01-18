

# GitHub
 
###  Recursos GitHub

* Web
[https://github.com/](https://github.com/)

* Tutorial
[https://guides.github.com/activities/hello-world/](https://guides.github.com/activities/hello-world/)

* Github Pages
[https://guides.github.com/features/pages/](https://guides.github.com/features/pages/)

* Tutorial
[http://rogerdudler.github.io/git-guide/index.es.html](http://rogerdudler.github.io/git-guide/index.es.html)

* Wikipedia
[https://es.wikipedia.org/wiki/GitHub](https://es.wikipedia.org/wiki/GitHub)

    


    
### Descripción 
>GitHub es un reporsitorio de código dónde podremos subir nuestros proyectos y también hosting de una pàgina web.

### Ejemplo crear web site

* Requisitos Instalar cliente GIT para windows [https://git-scm.com/download/win](https://git-scm.com/download/win)
 
### Paso 1

* Crear usuario en: [https://github.com/](https://github.com/)

### Paso 2

* Creamos nuevo repo llamado **geoweb**

![alt text](img/github-pas2.png "github")


* Copiamos URL del proyecto

![alt text](img/github-pas3.png "github")

### Paso 3 (opcion 1 nuestro caso).Si el directorio (proyecto) no existe en mi PC. Voy a mi espacio de trabajo
botón derecho del mouse -->"git bash here" y escribo en la consola ```git clone``` y pego la URL + Enter

```sh

git clone https://github.com/{tu usuario git}/geoweb.git

```

### Paso 3 (opcion 2). Si ya existe el directorio (proyecto)
* Crearemos repo des de nuestro pc [Tutorial](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)

* Nos situamos dentro del directorio **geoweb** de nuestro servidor y abrimos termial git (botón derecho mouse y Git Bash here)

```sh
git init
git add .
git commit -m "proyecto geoweb"
git remote add origin https://github.com/{tu usuario git}/geoweb.git
git remote -v
git push -u origin master

```
Atentificamos con usuario y password  

### Paso 4

* Abrimos VSCode  y añadimos directorio **geoweb**  **File -->Add folder to workspace**

![alt text](img/vscode1.png "vscode")

### Paso 5

* Creamos y/o editamos archivo **readme.md**

```sh 

### Proyector Geoweb 

### Documentación del curso

[https://gis-master-m2.github.io/m2-geoweb/](https://gis-master-m2.github.io/m2-geoweb/)

``` 
 
### Paso 6

* Añadimos y/o editamos archivo **hola.html**

```html 

<html>
    <head>
    </head>
    <body>
        <h3>Hola</h3>
    </body>
</html>

``` 
     
### Paso 7

 * Abrimos una terminal en VSCode  **View --> Terminal** y dentro de la terminal escribimos (linea + tecla Enter)

![alt text](img/vscode2.png "vscode")

```sh
git pull
```
```sh
git add .
```
```sh
git commit -m "change readme"
```
```sh
git push -u origin master
```

En total habríamos escrito estas 4 lineas

```sh
git pull
git add .
git commit -m "change readme"
git push -u origin master

```

!!! note
    Cada vez que editamos debemos hacer esta operación para subir código


### Paso 8

* Para convertir el repo en una página web, vamos al proyecto geoweb en github.com
* Seleccionamos opción Settings
* GitHub Pages  opción **master branch**
![alt text](img/github.png "github")
![alt text](img/github1.png "github")

### Para recuperar (clonar) nuestro trabajo en casa, por ejemplo

Nos situamos en un directorio de nuestor PC.
Botón derecho del mouse -->"Git bash here"

```sh
git clone  https://github.com/{tu usuario git}/geoweb.git
```
!!! note
    Si no aparece "Git bash here", tienes que instalar el cliente GIT
    [https://git-scm.com/download/win](https://git-scm.com/download/win)

#### Para (clonar) clonar la doumentación del curso

Nos situamos en un directorio de nuestor PC.
Botón derecho del mouse -->"Git bash here"

```sh
git clone  https://github.com/gis-master-m2/m2-geoweb.git
```


#### Para actualizar-sincronizar documentacion

Nos situamos *dentro* del directorio del proyecto, por ejemplo geoweb o m2-geoweb.
Botón derecho del mouse -->"Git bash here"

```sh
git pull
```

<hr>

# Medium
        
###  Recursos Medium

* Web
[https://medium.com//](https://medium.com/)

* Tutorials
[https://help.medium.com/hc/en-us/articles/225168768](https://help.medium.com/hc/en-us/articles/225168768)
[https://help.medium.com/hc/en-us/articles/115004681607-Create-a-publication](https://help.medium.com/hc/en-us/articles/115004681607-Create-a-publication)

* Tutorial
[https://blog.hubspot.com/marketing/how-to-use-medium](https://blog.hubspot.com/marketing/how-to-use-medium)

* Wikipedia
[hhttps://es.wikipedia.org/wiki/Medium_(servicio)](https://es.wikipedia.org/wiki/Medium_(servicio))

    


    
### Descripción 
>Medium es un servicio de publicación de blogs fundado por los cofundadores de Twitter Evan Williams y Biz Stone en agosto de 2012.1​ La plataforma ha evolucionado hacia un híbrido de contribuciones no profesionales, profesionales y pagadas.


### Algunos artículos de Medium sobre Leaflet

[https://medium.com/@Marseltov/how-good-is-leaflet-js-671b1bfe5505](https://medium.com/@Marseltov/how-good-is-leaflet-js-671b1bfe5505)

[https://medium.com/@michaelcoleman19/getting-started-with-leaflet-a0c859a5f80](https://medium.com/@michaelcoleman19/getting-started-with-leaflet-a0c859a5f80)

[https://medium.com/@dominicleung/first-try-with-leaflet-js-908bb04b5d95](https://medium.com/@dominicleung/first-try-with-leaflet-js-908bb04b5d95)


!!! note
    Nos damos de alta com usuarios en Medium
    [https://medium.com/](https://medium.com/)