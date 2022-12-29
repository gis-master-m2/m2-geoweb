

# 2. La Plataforma GitHub y órdenes básicas Git.
 
###  Recursos GitHub

* Web
[https://github.com/](https://github.com/){target=_blank}

* Tutorial
[https://guides.github.com/activities/hello-world/](https://guides.github.com/activities/hello-world/){target=_blank}

* Github Pages
[https://guides.github.com/features/pages/](https://guides.github.com/features/pages/){target=_blank}

* Tutorial
[http://rogerdudler.github.io/git-guide/index.es.html](http://rogerdudler.github.io/git-guide/index.es.html){target=_blank}

* Wikipedia
[https://es.wikipedia.org/wiki/GitHub](https://es.wikipedia.org/wiki/GitHub){target=_blank}

    
### ¿Qué es GitHub?
>GitHub plataforma web de desarrollo colaborativoque permite  para alojar proyectos utilizando el sistema de control de versiones **Git**. Se utiliza principalmente para la creación de código fuente software.
>También permite hacer hosting de pàginas web.

### ¿Para qué nos va servir GitHub? 
Para matener nuestros desarrollos y hacer hosting de nuestros mapas.

### ¿Qué es Git?

Git es un sistema de control de versiones desarrollado por Linus Torvalds (creador de Linux)
El sistema de control de versiones ayuda a registrar los cambios realizados al código por una o varias personas, posibilitando así el trabajo colaborativo y el versionado de software.

#### Flujo de trabajo
El repositorio local esta compuesto por tres "árboles" administrados por git. El primero es tu Directorio de trabajo que contiene los archivos, el segundo es el Index que actua como una zona intermedia, y el último es el HEAD que apunta al último commit realizado.

![alt text](img/trees.png "github")

<sub>Fuente: https://rogerdudler.github.io/git-guide/index.es.html</sub>

#### Órdenes básicas de Git

| Órdenes     | Description                          |
| ----------- | ------------------------------------ |
| `git clone <url_repo_git>`       | Clonar proyecto |
| `git pull`       | Recibir cambios proyecto remoto |
| `git add .`    | Añadir cambios al Índice local |
| `git commit -m "mensaje commit"`    | Realizar commit|
| `git push origin main`    | Enviar cambios al repositorio remoto |

<sub>Para saber más: https://desarrolloweb.com/manuales/manual-de-git.html</sub>

### Instalar cliente GIT

!!! warning "Atencion!!"
    Para poder lanzar órdenes GIT, clonar y mantener un reopositorio necessitamos tener instalado un cliente GIT 

* Instalar cliente GIT para windows [https://git-scm.com/download/win](https://git-scm.com/download/win){target=_blank}

<sub> NOTA: Para más información ver VIDEO 1 <sub>
 
