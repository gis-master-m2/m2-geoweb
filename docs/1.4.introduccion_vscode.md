

# 3. Mi primer proyecto en GitHub
 
### Descripción
>Vamos a crear un proyecto en GitHub dónde vamos a subir todo nuestros ejemplos de módulo asó como las prácticas
>Utlizaremos VisualStudio Code cómo editor web y también para , mediante órdenes GIT mantener nuestro repositorio

 
### Paso 1 - Crear usuario en GitHub

* Crear usuario en: [https://github.com/](https://github.com/){target=_blank}

!!! warning "Atencion!!"
    El nombre de **usuario** debe ser único y NO debe tener espacios ni accentos y será el subdominio de nuestras páginas web.
    Así por ejemplo podrías crear un usuario tipo vuestras iniciales más palabra descriptiva - ejemplo: **vpa_mapas** o **vpa_modulo2b**-

![alt text](img/github-user.png "user github")

<sub> NOTA: Para más información ver VIDEO 2 <sub>

### Paso 2 - Crear repositorio

* Una vez validado nuestro correo y creado el usuario, vamos al avatar de la parte superior-derecha y seleccionamos **Your repositories**

![alt text](img/github-repo.png "github")

* Nos mostrará que no tenemos repositorios y le damos al botón **New**

* Creamos nuevo repo llamado **geoweb**

![alt text](img/github-pas2.png "github")

<sub> NOTA: Para más información ver VIDEO 2 <sub>

### Paso 3 - Clonar proyecto en nuestro ordenador

* Vamos al botón verde "Code" seleccionamos **HTTPS** y copiamos la URL del proyecto


![alt text](img/github-pas3.png "github")

* Vamos a nuestro ordenador y nos situamos en el directorio dónde vamos a trabajar, por ejemplo **c:/MasterUPC/m2/**

* Botón derecho del mouse -->"Git Bash Here" y escribo en la consola ```git clone``` y pego la URL + Enter

![alt text](img/github-clone.png "github")


```sh

git clone https://github.com/{tu usuario git}/geoweb.git

```

Si es la primera vez que utilizamos GIT en el ordenador necesitamos configurar tu nombre de usuario y dirección email

En la misma consola dónde hemos hecho el clone escribimos

```sh
git config --global user.name "nuestro_usuario"

git config --global user.email nuestro_correo@example.com
```



!!! note
    Si no aparece "Git Bash Here", tienes que instalar el cliente GIT
    [https://git-scm.com/download/win](https://git-scm.com/download/win){target=_blank}


<sub> NOTA: Para más información ver VIDEO 3 <sub>

### Paso 4 -Añadir proyecto a VSCode

* Abrimos VSCode  y añadimos directorio **/geoweb** ```File -->Add folder to workspace```

![alt text](img/vscode1.png "vscode")

 
### Paso 5 - Creamos página html

* Situamos puntero encima de **geoweb** botón derecho del mouse --> ```New File``` y creamos **index.html**

* Copiamos el siguiente código HTML de la que será nuestra página de inicio 


```html 

<html>
<head>
  <title>Mis mapas M2B</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="author" content="autor" />
  <meta name="description" content="descripción página">
  <meta name="robots" content="index,follow">
</head>
<body>
  <h2>Mis mapas del módulo M2B</h2>
  <h4>Leaflet</h4>
  <ul>
    <li></li>
    <li></li>
    <li></li>
  </ul>
  <hr />
  <h4>MapBoxGL JS</h4>
  <ul>
    <li></li>
    <li></li>
    <li></li>
  </ul>
  <hr />
  <h4>KeplerGL</h4>
  <ul>
    <li></li>
    <li></li>
    <li></li>
  </ul>
  <hr />
  <h4>Prácticas</h4>
  <ul>
    <li></li>
    <li></li>
    <li></li>
  </ul>
  <hr />
</body>
</html>

``` 
     
Guardamos archivo ```crtl + s```

### Paso 6 - Visualizamos archivo

Para visualizar un archivo HTML No es recomendable hacerlo cómo si fuera un archivo local **file://**, es decir "doble-click" sobre el archivo, ya que podria contener código JavaScript que que no se ejecutara correctamente (por ejemplo todo aquello a cargar contenido a paritr de rutas relativas a un recurso web).
Es mejor visualizar archivos HTML via **http://**. 

Para ello instalaremos una extensión de VSCode llamada **LiveServer**

Si utlizamos VSCODE , instalamos extensión Live Server ```View -->Extensions```

 ![alt text](img/github-pas0.png "github")



### Paso 7 -Subir cambios a GitHub

 * Abrimos una terminal en VSCode  **View --> Terminal** y dentro de la terminal escribimos (linea + tecla Enter)

![alt text](img/vscode2.png "vscode")

```sh
git pull
```
```sh
git add .
```
```sh
git commit -m "add index.html"
```
```sh
git push -u origin main
```

!!! warning "Si al hacer *git pull* nos dice que no reconoce el comando GIT y hemos podido clonar el proyecto"

    * Hay que cambiar el tipo de teminal de **powershell** a **bash** en VSCode

![alt text](img/github-terminal.png "github")


!!! warning "Si al hacer commit la primera vez tenemos este aviso"

    ```bash 
    Run 

    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"

    to set your account's default identity.
    Omit --global to set the identity only in this repository.

    fatal: unable to auto-detect email address (got 'usuario@yourpc.(none)')
    ```


!!! Tip "Entramos nuestor usuario de git y volvemos a hacer push"

    ```sh

    git config --global user.email micorreo@gmail.com
    git config --global user.name  misusuario

    git pull
    git add .
    git commit -m "add index.html"
    git push -u origin main       

   
    ```

La primera vez puede ser que tengamos que autentificarnos en GitHub


![alt text](img/github-aut.png "autenticate")


Al final cada vez que subamos cambios debemos escribir estas 4 lineas

```sh
git pull
git add .
git commit -m "mensaje commit"
git push origin main

```

!!! note
    Cada vez que editamos debemos hacer esta operación para subir código


<sub> NOTA: Para más información ver VIDEO 4 <sub>

### Paso 8 -GitHub como webhosting

* Para convertir el repo en una página web, vamos al proyecto geoweb en github.com
* Seleccionamos opción Settings
* GitHub Pages -->Source opción **Branch main** -->Save
![alt text](img/github.png "github")
![alt text](img/github1.png "github")


<sub> NOTA: Para más información ver VIDEO 4 <sub>

### Paso 9 -Práctica no puntuable con GitHub


!!! success "Editar index.html"

    La pagina index.html no tiene estilo. ¿Podriás añadir css y divs para maquetar mejor la pàgina.
    Puedes utlizar librerías com [Bootstrap](https://getbootstrap.com/) o [Materialize](https://materializecss.com/) para un mejor diseño

   

!!! tip "pista"

     Recuerda que al final cada vez que subamos cambios debemos escribir estas 4 lineas

    ```sh
    git pull
    git add .
    git commit -m "mensaje commit"
    git push origin main

    ```

!!! example "Ejemplo con Bootstrap"

``` html
<html>
<head>
  <title>Mis mapas M2B</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="author" content="autor" />
  <meta name="description" content="descripción página">
  <meta name="robots" content="index,follow">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Inconsolata&display=swap" rel="stylesheet">
  <style>
    .seccion {
      border-radius: 0px !important;
    }
    .container {
      margin-top: 5px;
    }
    .mapbox {
      background-color: #e7e7f1;
    }
    .kepler {
      background-color: #f1e7ea;
    }
    .practicas {
      background-color: #e7f0f1;
    }
    .leaflet {
      background-color: #e7f1e8;
    }
    small {
      font-size: 60% !important;
    }
    .navbar {
      background-color: #f1e9e7 !important;
      border-radius: 0px !important;
    }
    .row {
      margin-top: 10px;
    }
    body {
      font-family: 'Inconsolata', sans-serif !important;
      font-size: 16px !important;
    }
    @media screen and (max-width: 500px) {
      body {
        font-size: 80% !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <nav class="navbar navbar-light bg-light">
      <h4>
        Mis mapas módulo M2B
        <br>
        <small>
          Mapas y OpenData, Localización, Visualización y Análisis de GeoDatos
        </small>
      </h4>
    </nav>
    <br>
    <div class="alert seccion leaflet">
      <h5>Mapas Leaflet</h5>
      <div class="row">
        <div class="col">
          <ul>
            <li>
              <!--añadir aqui entrada-->
            </li>
            <li>
              <!--añadir aqui entrada-->
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="alert seccion mapbox">
      <h5>Mapas Mapbox GL JS</h5>
      <div class="row">
        <div class="col">
          <ul>
           <li>
              <!--añadir aqui entrada-->
            </li>
            <li>
              <!--añadir aqui entrada-->
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="alert seccion kepler">
      <h5>Kepler.Gl</h5>
      <div class="row">
        <div class="col">
          <ul>
            <li>
              <!--añadir aqui entrada-->
            </li>
            <li>
              <!--añadir aqui entrada-->
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="alert seccion practicas">
      <h5>Prácticas puntuables</h5>
      <div class="row">
        <div class="col">
          <ul>
            <li>
              <!--añadir aqui entrada-->
            </li>
            <li>
              <!--añadir aqui entrada-->
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</body>
</html>

```



### Información anexa

#### Para tener la documentación del curso en nuestro repositorio

* Entamos en https://github.com/gis-master-m2/m2-geoweb

* Pulsmos ociopn(superior-derecha) **fork**

#### Para recuperar (clonar) nuestro trabajo en otro pc, por ejemplo

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



#### Para crear un proyecto desde nuestro PC directament a Github
* Crearemos repo des de nuestro pc [Tutorial](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)

* Nos situamos dentro del directorio **geoweb** de nuestro servidor y abrimos termial git (botón derecho mouse y Git Bash here)

```sh
git init
git add .
git commit -m "proyecto geoweb"
git remote add origin https://github.com/{tu usuario git}/geoweb.git
git remote -v
git push -u origin main

```
Atentificamos con usuario y password  

<hr>

