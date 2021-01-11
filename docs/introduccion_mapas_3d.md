## Introducción

Gracias a la poténcia de WebGL y los nuevos navegadores , cada vez hay más librerias geoweb con capacidades 3D

La visualización 3D no sólo se limita a la extrusión del terreno síno que va más allá, como por ejemplo visualización de nubes de puntos [lidar](http://betaserver.icgc.cat/potree/examples/gironaen3d.html){target=_blank} , visión hiperrealista de [ciudades](http://betaserver.icgc.cat/cesium/Girona3D.html){target=_blank}




## Algunas librerías geo con capacidades 3D

[MapBox GL JS](https://www.mapbox.com/blog/mapbox-gl-js-v2-3d-maps-camera-api-sky-api-launch){target=_blank}

[Cesium JS](https://cesium.com/){target=_blank}

[Deck.GL](https://deck.gl/){target=_blank}

[Procedural](https://www.procedural.eu/){target=_blank}

[Threejs](https://threejs.org/){target=_blank}

[Potree](https://github.com/potree/potree/){target=_blank}

[ArcGis API JavaScript](https://www.esri.com/arcgis-blog/products/js-api-arcgis/3d-gis/arcgis-api-for-javascript-camera-intro/){target=_blank}

## Algunos formatos 3D geo

 **3D-Tiles**: Especificación estándar OGC creada por Cesium para la creación de piràmides de datos vectores con información 3D .

 **3D Scene Layers (I3S)**:Especificación estándar OGC creada por ESRI para la creación de piràmides de datos vectores con información 3D

 **Terrain-RGB**: Datos de elevación codificados en teselas PNG rasterizadas como valores de color que pueden ser decodificados a alturas en metros



### Cómo ver un mapa 3D en Mapbox GL

!!! note "Método setTerrain [https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setterrain](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setterrain){target=_blank}"

#### Paso 1 : Creamos con VSCode **mapa3d.html**

* Vamos a VSCode y creamos el archivo **mapa3d.html** dentro de **/geoweb**


```html
    <html>
    <head>
    <meta charset='utf-8' />
    <title>Mapa 3D</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css' rel='stylesheet' />
    <link href='css/estilobase.css' rel='stylesheet' />
 
    <script src='js/3d.js'></script>
    <script>
        //Añadir vuestor token!!
        var map;
        function init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
             map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/satellite-streets-v10',
                center: [2.16859, 41.3954],
                zoom: 12,
                attributionControl: false,
                pitch: 45,
                hash: true
            });

            map.addControl(new mapboxgl.AttributionControl({ compact: true }));
            map.addControl(new mapboxgl.NavigationControl());

        } // final init
    </script>
    </head>

    <body onload="init()">
        
        <div id="map"></div>
    </body>

    </html>

```

#### Paso 3: Creamos archivo 3d.js

 * Dentro de nuestro directorio **/geoweb/js/** creamos el archivo **3d.js**, dónde crearemos funciones especificas de nuestro proyecto  

 * Creamos la función **add3D()**

```javascript

   function add3D() {

    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });
    
    map.setTerrain({
        'source': 'mapbox-dem',
        'exaggeration': 1.5
    });

    
    map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
        }
    });

} //fin funcion

```
    

#### Paso 4: Llamamos funciones en el evento load de map

 * Llamamos a la función **add3D()**


``` html hl_lines="30 31 32"
    <html>
    <head>
    <meta charset='utf-8' />
    <title>Mapa 3D</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css' rel='stylesheet' />
    <link href='css/estilobase.css' rel='stylesheet' />
 
    <script src='js/3d.js'></script>
    <script>
        //Añadir vuestor token!!
        var map;
        function init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
             map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/satellite-streets-v10',
                center: [2.16859, 41.3954],
                zoom: 12,
                attributionControl: false,
                pitch: 45,
                hash: true
            });

            map.addControl(new mapboxgl.AttributionControl({ compact: true }));
            map.addControl(new mapboxgl.NavigationControl());

            map.on('load', function () {
             add3D();
            }); //fin onload

        } // final init
    </script>
    </head>

    <body onload="init()">
        
        <div id="map"></div>
    </body>

    </html>

```

!!! success "visualizamos el mapa"
![alt text](img/mapbox-3d.png "mapbox-3d.png")

!!! success "Cambiamos el estilo del mapa"


!!! success "¿Subimos el ejemplo al GitHub?"
	
	```bash

		git pull
        git add .
        git commit -m "visor 3d"
        git push

	``` 
