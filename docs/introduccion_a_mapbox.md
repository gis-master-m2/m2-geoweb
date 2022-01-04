
<img src="https://c1.staticflickr.com/3/2863/33742461420_90c7cd525f_o.png" width="250"> 
       
#### Web
* [https://www.mapbox.com/](https://www.mapbox.com/){target=_blank}

#### Productos
* [https://www.mapbox.com/products/](https://www.mapbox.com/products/){target=_blank}

#### APIs
* [https://www.mapbox.com/api-documentation/](https://www.mapbox.com/api-documentation/){target=_blank}

#### **Página referéncia MapBox GL!!**
* [https://www.mapbox.com/mapbox-gl-js/api/](https://www.mapbox.com/mapbox-gl-js/api/){target=_blank}

#### GitHUB
* [https://github.com/mapbox](https://github.com/mapbox){target=_blank}

#### Tutoriales
* [https://docs.mapbox.com/help/tutorials/?product=Mapbox+GL+JS](https://docs.mapbox.com/help/tutorials/?product=Mapbox+GL+JS){target=_blank}
* [https://www.mapbox.com/mapbox-gl-js/example/simple-map/](https://www.mapbox.com/mapbox-gl-js/example/simple-map/){target=_blank}
* [https://www.mapbox.com/help/tutorials/](https://www.mapbox.com/help/tutorials/){target=_blank}
* [https://www.mapbox.com/help/studio-manual/](https://www.mapbox.com/help/studio-manual/){target=_blank}
* [https://ovrdc.github.io/gis-tutorials/mapbox/](https://ovrdc.github.io/gis-tutorials/mapbox/){target=_blank}

#### Videos
* [https://www.youtube.com/watch?v=jrnoFU5Wkdo](https://www.youtube.com/watch?v=jrnoFU5Wkdo){target=_blank}
* [https://www.youtube.com/watch?v=Zn3Xx-TSrM8](https://www.youtube.com/watch?v=Zn3Xx-TSrM8){target=_blank}
* [https://www.youtube.com/watch?v=r6Ij_34xTD0](https://www.youtube.com/watch?v=r6Ij_34xTD0){target=_blank}
* [https://www.youtube.com/watch?v=YhynsA9_fPc](https://www.youtube.com/watch?v=YhynsA9_fPc){target=_blank}




### Descripción 

> MapxBox es una empresa privada que ofrece una plataforma para la publicacón de mapas. Mapbox destaca por creado de forma abierta
> MBTiles
> Vector Tiles
> MapBox GL

* MapBox Studio es un editor web para crear, personalizar y publicar estilos de mapa vector
* MapBox GL JS es una libreria para programas aplicaciones basadas en MapBox Styles

!!! note "Los colores y aspecto de nuestro mapa deben estar condicionados por aquello que querramos mostrar o para dar contexto a los datos que vamos a añadir"
     
###  ¿Cómo empezar?

> Nos creamos usuario en [MapBox.com](https://www.mapbox.com/signup/){target=_blank}

!!! tip "Cada usuario tiene un **Access Token** necessario para desarrollar y usar aplicaciones de Mapbox"
    De forma gratuita MapBox nos ofrece hasta 50.000 cargas cada mes

   ![alt text](img/mapbox-accesstoken.png "mapbox-accesstoken.png") 

### Empezamos con MapBox Studio

#### Paso 1-Creamos nuestro propio estilo

* Entramos en https://account.mapbox.com/  seleccionamos nuestro avatar (parte superior-derecha) --> `Studio` 


![alt text](img/mapbox-avatar.png "mapbox-avatar.png") 

* Dentro de Studio tenemos tres opciones básicas

| Opciones     | Descripción                         |
| ----------- | ------------------------------------ |
| **Styles**     | Para crear nuestros estilos pròpios |
| **Tilesets**       | Para subir nuestros datos y convertirlos en Vector Tiles y/o integrarlos con nuestros estilos |
| **Dataset**    | Para subir capas GeoJson que pueden ser convertidas a Tilesets |


* Seleccionamos -->`Styles` --> `New style`

![alt text](img/mapbox1.png "mapbox")

* Seleccionamos un estilo como base (Base) y cambiamos variación colores (Galaxy) --> `Customize`

![alt text](img/mapbox11.png "mapbox")

* Cambiamos nombre del estilo --Parte superion izquierda- por  "Bicing"

![alt text](img/mapbox10.png "mapbox")


#### Paso 2- Empezamos edición

* Podemos editar a dos niveles

    * Por components: Són agrupaciones de capas por temas, loas cambios afectarán a todas las capas del tema (edición rápida)
    * Por capas: Editaremos capas de forma individual

* Para editar click encima del nombre del componente y(o layer)

![alt text](img/mapbox-edit.png "mapbox")

!!! tip "Dedicamos 30 minutos a explorar i editar nuestro estilo"


#### Paso 3- Publicación

![alt text](img/mapbox-edit.png "mapbox")

* Una vez hemos acabado -->`Publish your style` --> `Publish as new`

* Share, develop, and use your style

  * Share style -->`Preview only` --> Pegamos  URL en navegador
  * Developer resources --> `Style URL` y `Access token`  (copiamos para nuestras aplicaciones con Mapbox GL JS)

![alt text](img/mapbox12.png "mapbox")

!!! tip "Truco"
    <h5>
    Si seleccionamos "Third party" también podemos consumir el estilo com WMTS (Raster) en Leaflet o QGIS!!
    </h5>
    ![alt text](img/mapbox30.png "mapbox")


### Cartogram otra forma divertida de editar un estilo

* Buscamos y descargamos una foto, logo, etc..

 Nos vamos a  [https://apps.mapbox.com/cartogram/](https://apps.mapbox.com/cartogram/){target=_blank} y creamos otro estilo


### Librería Mapbox GL JS

MapBox tiene una libreria JavaScript llamada *MapBox GL JS* para poder programas visores y visualizar estilos entre otras muchas otras funcionalidades

**Página referéncia MapBox GL!!**

* [https://www.mapbox.com/mapbox-gl-js/api/](https://www.mapbox.com/mapbox-gl-js/api/){target=_blank}


!!! warning
    <h4>
    Siempre que utilizemos algún estilo de Mapbox studio o algún servicio de Mapbox  deberemos añadir nuestro Access Token
    </h4>

#### 1-Visualizar estilo con Mapbox GL JS

El objeto principal del mapa en Mapbox gl js se llama **mapboxgl.Map**

!!! tip "mapboxgl.Map"

        Es el constructor principal del mapa [https://docs.mapbox.com/mapbox-gl-js/api/#map](https://docs.mapbox.com/mapbox-gl-js/api/#map){target=_blank}

        ```javascript
            var map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
                center: [-74.5, 40], // starting position [lng, lat]
                zoom: 9 // starting zoom
                });
        ```

#### Paso 1 Abrimos VSCODE y creamos **mapbox-basico.html** dentro de nuestro directorio **geoweb**

```html
<html>
<head>
    <meta charset='utf-8' />
    <title>Mapbox básico</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css' rel='stylesheet' />
    <style>
        body {
            margin: 0;
            padding: 0;
        }
        #map {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%
        }
    </style>
    <script>
        //Añadir vuestor token y vuestro estilo
        function init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/outdoors-v11',
                center: [2.16859, 41.3954],
                zoom: 13,
                attributionControl: false
            });

        }
    </script>
</head>

<body onload="init()">
    <div id="map"></div>
</body>

</html>  

```


#### Paso 2 Cambiamos el estilo outdoors por nuestro estilo

```html hl_lines="28"
<html>
<head>
    <meta charset='utf-8' />
    <title>Mapbox básico</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css' rel='stylesheet' />
    <style>
        body {
            margin: 0;
            padding: 0;
        }
        #map {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%
        }
    </style>
    <script>
        //Añadir vuestor token y vuestro estilo
        function init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/gismasterm2/ckjmupbtl28od19k9rmflcgxf',
                center: [2.16859, 41.3954],
                zoom: 13,
                attributionControl: false
            });

        }
    </script>
</head>

<body onload="init()">
    <div id="map"></div>
</body>

</html>  

```



!!! tip "¿Cómo añadiriamos la opción `hash` al mapa ?"


#### Paso 3 - Podemos añadir algunos controles

!!! example "Controles"
    
    [https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol](https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol){target=_blank}


    NavigationControl

    GeolocateControl

    AttributionControl

    ScaleControl

    FullscreenControl

    Popup

    Marker

```html hl_lines="33 34"
 <html>
<head>
    <meta charset='utf-8' />
    <title>Mapbox estilo</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css' rel='stylesheet' />
    <style>
        body {
            margin: 0;
            padding: 0;
        }
        #map {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%
        }
    </style>
    <script>
        //Añadir vuestor token y vuestro estilo
        function init(){
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/gismasterm2/ckjmupbtl28od19k9rmflcgxf',
                center: [2.16859, 41.3954],
                zoom: 13,
                attributionControl: false
            });
            map.addControl(new mapboxgl.AttributionControl({compact: true}));
            map.addControl(new mapboxgl.NavigationControl());
        }
    </script>
</head>

<body onload="init()">
    <div id="map"></div>
</body>

</html>
```

!!! tip "¿Añadimos control GeoLocalización?"
    
    [https://docs.mapbox.com/mapbox-gl-js/api/#geolocatecontrol](https://docs.mapbox.com/mapbox-gl-js/api/#geolocatecontrol){target=_blank}

    ```javascript
    map.addControl(new mapboxgl.GeolocateControl());

    ```
    o con opciones...

    ```javascript

    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));

    ```



!!! tip "¿Añadimos un marker?"
    
    [https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker){target=_blank}
    
    ``` javascript
       var marker = new mapboxgl.Marker()
                .setLngLat([2.161648, 41.3977])
                .setPopup(new mapboxgl.Popup().setHTML('<h3>Hola</h3>'))
                .addTo(map);

    ```


### 3- Añadir una capa nueva (tileset) propia a un estilo con MapBox Studio

Nos gustaria que en nuestro estilo estuvieran los carriles bici de Barcelona


[https://opendata-ajuntament.barcelona.cat/data/es/dataset/carril-bici](https://opendata-ajuntament.barcelona.cat/data/es/dataset/carril-bici){target=_blank}


#### Paso 1

* Descargamos el archivo [carril-bici.geojson](datos/carril-bici.geojson){target=_blank}
  

* Podemos utilizar QGIS o https://geojson.io/ para visualizarlo

     
#### Paso 2 -Añadimos la capa a Mapbox Stuio

* Entramos en MapBox.com `Studio` --> `Tilesets` -->`New tileset` Arrastramos **carril-bici.geojson**

* Añadimos TileSet a nuestro estilo

* `Studio` --> `Styles` -->`Bicing` --> `Layers` --> `Add Layer` -->`Carril_Bici`

![alt text](img/mapbox2.png "mapbox")


* Cambiamos color

* Publicamos

* Visualizamos **mapbox-basico.html**  ¿Que ha pasado?

 

### 4- Visualizar nuestor propio Tileset como una capa independiente


* Nos gustaría añadir también vias ciclables de Barcelona (vias que no son carriles bici pero se puede ir en bicicleta ) [https://opendata-ajuntament.barcelona.cat/data/es/dataset/vies-ciclables](https://opendata-ajuntament.barcelona.cat/data/es/dataset/vies-ciclables){target=_blank}


#### Paso 1

* Descargamos el archivo [vias_ciclables.geojson](datos/vias_ciclables.geojson){target=_blank}
  
* Podemos utilizar QGIS o https://geojson.io/ para visualizarlo

#### Paso 2

* Entramos en MapBox.com `Studio` --> `Tilesets` -->`New tileset` Arrastramos **vias_ciclables.geojson**

*Copiamos ID y nombre de la capa

![alt text](img/mapbox22.png "mapbox")

Editamos **mapbox-basico.html** y añadimos

```html hl_lines="37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53"
<html>
<head>
    <meta charset='utf-8' />
    <title>Mapbox estilo</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css' rel='stylesheet' />
    <style>
        body {
            margin: 0;
            padding: 0;
        }
        #map {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%
        }
    </style>
    <script>
        //Añadir vuestor token y vuestro estilo
        function init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/gismasterm2/ckjmupbtl28od19k9rmflcgxf',
                center: [2.16859, 41.3954],
                zoom: 13,
                attributionControl: false
            });
            map.addControl(new mapboxgl.AttributionControl({compact: true}));
            map.addControl(new mapboxgl.NavigationControl());


            map.on('load', function () {
                map.addSource("viasciclables_source", {
                    type: "vector",
                    url: "mapbox://gismasterm2.25lhjr43" //poner mapbox://vuestro id
                }); //fin map source

                map.addLayer({
                    id: "viasciclables",
                    type: "line",
                    source: "viasciclables_source",
                    'source-layer': "vias_ciclables-2smuz5", //poner vuestro titulo capa
                    paint:{
                        'line-color':"#00ff00",
                        "line-width":3
                    }
                });
            });


        }
    </script>
</head>

<body onload="init()">
    <div id="map"></div>
</body>

</html>

``` 



!!! tip "Eventos del mapa"
    
    [https://docs.mapbox.com/mapbox-gl-js/api/#map.event:click](https://docs.mapbox.com/mapbox-gl-js/api/#map.event:click){target=_blank}
    

!!! success "Añadimos un Popup al evento click"

```html hl_lines="55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76"
<html>
<head>
    <meta charset='utf-8' />
    <title>Mapbox estilo</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css' rel='stylesheet' />
    <style>
        body {
            margin: 0;
            padding: 0;
        }
        #map {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%
        }
    </style>
    <script>
        //Añadir vuestor token y vuestro estilo
        function init() {
            mapboxgl.accessToken ='pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/gismasterm2/ckjmupbtl28od19k9rmflcgxf',
                center: [2.16859, 41.3954],
                zoom: 13,
                attributionControl: false
            });
            map.addControl(new mapboxgl.AttributionControl({compact: true}));
            map.addControl(new mapboxgl.NavigationControl());


            map.on('load', function () {
                map.addSource("viasciclables_source", {
                    type: "vector",
                    url: "mapbox://gismasterm2.25lhjr43" //poner mapbox://vuestro id
                }); //fin map source

                map.addLayer({
                    id: "viasciclables",
                    type: "line",
                    source: "viasciclables_source",
                    'source-layer': "VIES_CICLABLES-2smuz5", //poner vuestro titulo capa
                    paint:{
                        'line-color':"#00ff00",
                        "line-width":3
                    }
                });
            });


             map.on('click','viasciclables',function(e){
                  
                    var text = "";
                    //console.info(e);
                    for (key in e.features[0].properties){

                      text += "<b>"+key+"</b>:"+e.features[0].properties[key]+"<br>";
                    }
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(text)
                        .addTo(map);

                    });

                  map.on('mouseenter', 'viasciclables', function() {
                      map.getCanvas().style.cursor = 'pointer';                    
                  });
                  
                  map.on('mouseleave', 'viasciclables', function() {
                     map.getCanvas().style.cursor = '';                    
                  });


        }
    </script>
</head>

<body onload="init()">
    <div id="map"></div>
</body>

</html>

```


!!! success "¿Subimos el ejemplo al GitHub?"
	
	```bash

		git pull
        git add .
        git commit -m "mapa mapbox"
        git push

	```   



### Ejemplo Extra: Visualizar estilo Mapbox en Leaflet

```html
  <html lang="es">

<head>
    <title>Leaflet y Mapox</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="autor" />
    <meta name="description" content="descripción página">
    <meta name="robots" content="index,follow">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        #map {
            height: 100%;
            width: 100%;
        }
    </style>
    <script>
        var map;
        var capa1;

        function init() {
            map = L.map('map', {
                center: [41.6863, 1.8382],
                zoom: 8,
                attributionControl: false
            });
            // substituir por vuestra layer
            // Substituir "wmts" por "tiles/256/{z}/{x}/{y}"
            /*
            https://api.mapbox.com/styles/v1/gismasterm2/ck4zvjxxs2b8m1cmjumqlru5i/wmts?access_token=pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA
            */
            capa1 = L.tileLayer(
                'https://api.mapbox.com/styles/v1/gismasterm2/ck4zvjxxs2b8m1cmjumqlru5i/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA', {
                    maxZoom: 19,
                    minZoom: 1,
                    attribution: 'Mapbox'
                });
            capa1.addTo(map);

        }
    </script>
</head>

<body onload="init()">
    <div id="map"></div>
</body>

</html>

```

!!! success "¿Subimos el ejemplo al GitHub?"
	
	```bash

		git pull
        git add .
        git commit -m "mapa base mapbox"
        git push

	```       

