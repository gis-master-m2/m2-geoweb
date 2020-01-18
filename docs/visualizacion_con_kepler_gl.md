![alt text](img/kepler-logo.png "Kepler GL")
       
#### Web
* [https://kepler.gl/](https://kepler.gl/)

#### Aplicación
* [https://kepler.gl/demo](https://kepler.gl/demo)


#### **Página referéncia Kepler GL**
* [https://github.com/keplergl/kepler.gl/blob/master/docs/user-guides/a-introduction.md](https://github.com/keplergl/kepler.gl/blob/master/docs/user-guides/a-introduction.md)

#### GitHUB
* [https://github.com/keplergl](https://github.com/keplergl)

#### Tutoriales
* [https://github.com/keplergl/kepler.gl/blob/master/docs/user-guides/a-introduction.md](https://github.com/keplergl/kepler.gl/blob/master/docs/user-guides/a-introduction.md)
* [https://github.com/keplergl/kepler.gl/blob/master/docs/user-guides/j-get-started.md](https://github.com/keplergl/kepler.gl/blob/master/docs/user-guides/j-get-started.md)


#### Videos
* [https://www.youtube.com/watch?v=b8wKEY4dlvg](https://www.youtube.com/watch?v=b8wKEY4dlvg)
* [https://www.youtube.com/watch?v=y-SA6bOv4Eo](https://www.youtube.com/watch?v=y-SA6bOv4Eo)
* [https://www.youtube.com/watch?v=i2fRN4e2s0A](https://www.youtube.com/watch?v=i2fRN4e2s0A)



### Descripción 

Kepler.gl es una aplicación desrrollada por Uber, en un principio para uso interno, para analizar y visualizar sus propios datos.

Esta basada en WebGL pensada para  la exploración visual de conjuntos de datos de geolocalización a gran escala. Construido en la parte superior de deck.gl, kepler.gl puede representar millones de puntos que representan miles de viajes y realizar agregaciones espaciales sobre la marcha.

![alt text](img/kepler.png "Kepler GL")


### Ejercicio de visualización con Kepler.gl

!!! "Queremos analizar los accidentes de coche en la ciudad de Barcelona"

    Hemos visto este post en Medium [https://towardsdatascience.com/analysis-of-car-accidents-in-barcelona-using-pandas-matplotlib-and-folium-73384240106b](https://towardsdatascience.com/analysis-of-car-accidents-in-barcelona-using-pandas-matplotlib-and-folium-73384240106b)
    
### Preparación datos
git
"2005-11-29T17:03:03.00"
* Origen dataset CSV de [https://opendata-ajuntament.barcelona.cat/data/es/dataset/accidents-tipus-gu-bcn](datos/2018_accidents_tipus_gu_bcn_TIME.csv)

* Descargamos [2018_accidents_tipus_gu_bcn_.csv](datos/2018_accidents_tipus_gu_bcn_TIME.csv)

* En este archivo se han conatenado las fechas para genera un nuevo campo tipo timestamp

!!! Truco "Con LibreOffice seria"
    ```
    =CONCATENATE(L2;"-";M2;"-";O2;"T";P2;":00")
    ```



#### Paso1 : Añadir datos el mapa

* Vamos a http://kepler.gl/#/demo 

* Cargamos **2018_accidents_tipus_gu_bcn_TIME.csv**


#### Paso2 : Añadimos estilo própio


![alt text](img/kepler01.png "Kepler GL")

`Base map` -->`add Map Style` --> `Paste style url` 



#### Paso2 : Añadir capas
#### Paso1 : Añadir filtros
#### Paso1 : Definir "tooltips"
#### Paso1 : Guardar y exporta a HTML
#### Paso1 : Subir al GIT


>  `Añadimos csv`

![alt text](img/step1-kepler.png "add dataset")


> `Add Layer: Type Hexbin`

> `Columns: Latitud Longuitud`

> `Color: Scale Quantize`

> `Hexagon radius 0.1`

> `Coverage 0.75`

![alt text](img/step2-kepler.png "add dataset")

!!!Info 
    Continuamos añadiendo más capas y mapas bases
