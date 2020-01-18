
<img src="https://cesiumjs.org/Cesium/Apps/Sandcastle/images/Cesium_Logo_Color_Overlay.png" width="200"> 
       
 
### Recursos Cesium JS

* 
Web
[https://cesiumjs.org/](https://cesiumjs.org/)

* 
API
[https://cesiumjs.org/refdoc/](https://cesiumjs.org/refdoc/)

* 
Ejemplos
[https://cesiumjs.org/Cesium/Build/Apps/Sandcastle/index.html](https://cesiumjs.org/Cesium/Build/Apps/Sandcastle/index.html)

* 
Definición
[https://en.wikipedia.org/wiki/Virtual_globe](https://en.wikipedia.org/wiki/Virtual_globe)

* 
Tutoriales

[http://cesiumjs.org/tutorials.html](http://cesiumjs.org/tutorials.html)
[http://cesiumjs.org/demos.html](http://cesiumjs.org/demos.html)
[http://developer.digitalglobe.com/docs/maps-api/integration-examples/maps-apicesium-js/](http://developer.digitalglobe.com/docs/maps-api/integration-examples/maps-apicesium-js/)
[http://cesiumjs.org/Cesium/Apps/Sandcastle/index.html](http://cesiumjs.org/Cesium/Apps/Sandcastle/index.html)


* 
Videos
[https://www.youtube.com/watch?v=ELYsCn-caXY](https://www.youtube.com/watch?v=ELYsCn-caXY)
[https://www.youtube.com/watch?v=YZ_2T6dgSw4](https://www.youtube.com/watch?v=YZ_2T6dgSw4)
[https://www.youtube.com/watch?v=S745qetDaCc](https://www.youtube.com/watch?v=S745qetDaCc)
[https://www.youtube.com/watch?v=lhzYRnNYmwo](https://www.youtube.com/watch?v=lhzYRnNYmwo)

     
    

    
### Descripción 
>Cesium JS es una libreria basada en WebGL, creada por la empresa AGI, que permite trabajar con globos virtuales 3D
>Cesium destaca por haber creado de forma abierta las especificaciones de :
>*  Formato GLTF
>*  Especificación 3D Vector-Tiles
     

###  ¿Cómo empezar? 
  * Nos damos de alta en [https://cesium.com/ion/signup?gs=true](https://cesium.com/ion/signup?gs=true)
  * Copiamos nuestro token  ```Access Tokens```


#### Mapa básico
*  Creamos **cesium-basico.html** dentro directorio geoweb Ejemplo básico :


```html
<html lang="es">
<head>
    <title>Ejemplo 0 Cesium básico</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="autor" />
    <meta name="description" content="descripción página">
    <meta name="robots" content="index,follow">
    <script src="https://cesiumjs.org/releases/1.65/Build/Cesium/Cesium.js"></script>
    <link href="https://cesiumjs.org/releases/1.65/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
    <style>
        #map {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            margin: 0;
            overflow: hidden;
            padding: 0;
        }

        body {
            padding: 0;
            margin: 0;
            overflow: hidden;
            height: 100%;
        }
    </style>
    <script>
        function Init() {
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjVkZDdjMC0zNWNjLTRkMTktODM0YS1lNzVkYjQwNWQzNmEiLCJpZCI6NDMyLCJpYXQiOjE1MjUyNDI1NDR9.gnm-s8YmqoAXwQTr-dT-CCQkGxe5jk_8b6xFUd1VxgY';
            map = new Cesium.Viewer('map');

            //add Properties

            /*
             map.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees( 2.1806,41.4003, 15000)
            });

             */
        };
    </script>
</head>
<body onload="Init()">
    <div id="map"></div>
</body>
</html>

```

#### Mapa personalizado

* Creamos **cesium-personalizado.html**

```html
   <html lang="es">

<head>
    <title>Ejemplo 0 Cesium básico</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="autor" />
    <meta name="description" content="descripción página">
    <meta name="robots" content="index,follow">
    <script src="https://cesiumjs.org/releases/1.65/Build/Cesium/Cesium.js"></script>
    <link href="https://cesiumjs.org/releases/1.65/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
    <style>
        #map {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            margin: 0;
            overflow: hidden;
            padding: 0;
        }

        body {
            padding: 0;
            margin: 0;
            overflow: hidden;
            height: 100%;
        }
    </style>
    <script>
        function Init() {
            Cesium.Ion.defaultAccessToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjVkZDdjMC0zNWNjLTRkMTktODM0YS1lNzVkYjQwNWQzNmEiLCJpZCI6NDMyLCJpYXQiOjE1MjUyNDI1NDR9.gnm-s8YmqoAXwQTr-dT-CCQkGxe5jk_8b6xFUd1VxgY';
            map = new Cesium.Viewer('map', {

                imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                    url: '//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/',
                }),

                timeline: false,
                navigationHelpButton: true,
                scene3DOnly: true,
                fullscreenButton: true,
                baseLayerPicker: false,
                homeButton: false,
                infoBox: true,
                sceneModePicker: false,
                animation: false,
                geocoder: false,
                sceneMode: Cesium.SceneMode.SCENE3D,
                terrainProvider: Cesium.createWorldTerrain()

            });


            map.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(2.1806, 41.4003, 15000),
                orientation: {
                    pitch: Cesium.Math.toRadians(-45.0)
                },
            });
        };
    </script>
</head>

<body onload="Init()">
    <div id="map"></div>
</body>

</html>
``` 

#### Mapa con datos externos GeoJSON

* Creamos **cesium-ruta.html**

```html
<html lang="es">

<head>
    <title>Ruta cesium</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="autor" />
    <meta name="description" content="descripción página">
    <meta name="robots" content="index,follow">
    <script src="https://cesiumjs.org/releases/1.65/Build/Cesium/Cesium.js"></script>
    <link href="https://cesiumjs.org/releases/1.65/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
    <style>
        #map {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            margin: 0;
            overflow: hidden;
            padding: 0;
        }

        body {
            padding: 0;
            margin: 0;
            overflow: hidden;
            height: 100%;
        }
    </style>
    <script>
        function Init() {
            Cesium.Ion.defaultAccessToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjVkZDdjMC0zNWNjLTRkMTktODM0YS1lNzVkYjQwNWQzNmEiLCJpZCI6NDMyLCJpYXQiOjE1MjUyNDI1NDR9.gnm-s8YmqoAXwQTr-dT-CCQkGxe5jk_8b6xFUd1VxgY';
            map = new Cesium.Viewer('map', {

                imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                    url: '//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/',
                }),

                timeline: false,
                navigationHelpButton: true,
                scene3DOnly: true,
                fullscreenButton: true,
                baseLayerPicker: false,
                homeButton: false,
                infoBox: true,
                sceneModePicker: false,
                animation: false,
                geocoder: false,
                sceneMode: Cesium.SceneMode.SCENE3D,
                terrainProvider: Cesium.createWorldTerrain()

            });

            GPX_lyr = Cesium.GeoJsonDataSource.load('datos/ruta.geojson', {
                stroke: Cesium.Color.RED,
                strokeWidth: 3,
                clampToGround: true
            });

            GPX_lyr.then(function (dataSource) {
                map.dataSources.add(dataSource);
                map.flyTo(dataSource);
            });

        };
    </script>
</head>

<body onload="Init()">
    <div id="map"></div>
</body>

</html>

```

#### Mapa Cesium con Mapbox y/o ICGC

* Creamos **cesium-mapbox-icgc.html**

```html
    <html lang="es">

<head>
    <title>Ejemplo 0 Cesium básico</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="autor" />
    <meta name="description" content="descripción página">
    <meta name="robots" content="index,follow">
    <script src="https://cesiumjs.org/releases/1.65/Build/Cesium/Cesium.js"></script>
    <link href="https://cesiumjs.org/releases/1.65/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
    <style>
        #map {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            margin: 0;
            overflow: hidden;
            padding: 0;
        }

        body {
            padding: 0;
            margin: 0;
            overflow: hidden;
            height: 100%;
        }
    </style>
    <script>
        function Init() {


            var imageReference = new Cesium.UrlTemplateImageryProvider({
                url: 'https://api.mapbox.com/styles/v1/gismasterm2/cjqg9p2lm00442rqm4vlk89rt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA'
            });


            /*
                var imageReference=new Cesium.createOpenStreetMapImageryProvider({
                url: 'https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/',
                fileExtension: 'jpeg',
                maximumLevel: 19,
                credit: 'Institut Cartogràfic i Geològic de Catalunya'
                });

            */

            Cesium.Ion.defaultAccessToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjVkZDdjMC0zNWNjLTRkMTktODM0YS1lNzVkYjQwNWQzNmEiLCJpZCI6NDMyLCJpYXQiOjE1MjUyNDI1NDR9.gnm-s8YmqoAXwQTr-dT-CCQkGxe5jk_8b6xFUd1VxgY';
            map = new Cesium.Viewer('map', {

                imageryProvider: imageReference,
                timeline: false,
                navigationHelpButton: true,
                scene3DOnly: true,
                fullscreenButton: true,
                baseLayerPicker: false,
                homeButton: false,
                infoBox: true,
                sceneModePicker: false,
                animation: false,
                geocoder: false,
                sceneMode: Cesium.SceneMode.SCENE3D,
                terrainProvider: Cesium.createWorldTerrain()

            });


            map.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(2.1806, 41.4003, 15000),
                orientation: {
                    pitch: Cesium.Math.toRadians(-45.0)
                },
            });
        };
    </script>
</head>

<body onload="Init()">
    <div id="map"></div>
</body>

</html>

```


#### Mapa con capas
* Creamos **cesium-capas.html**

```html
  <html lang="es">
<head>
    <title>Ejemplo extra</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="autor" />
    <meta name="description" content="descripción página">
    <meta name="robots" content="index,follow">
    <script src="https://cesiumjs.org/releases/1.65/Build/Cesium/Cesium.js"></script>
    <link href="https://cesiumjs.org/releases/1.65/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <style>
        #map {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            margin: 0;
            overflow: hidden;
            padding: 0;
        }

        body {
            padding: 0;
            margin: 0;
            overflow: hidden;
            height: 100%;
        }


        html {
            height: 100%;
        }

        #capas {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
            width: auto;
            height: auto;

            background-color: white;
        }

        li {
            list-style-type: none;
        }

        ul {
            padding: 10px !important
        }
    </style>
    <script>
        function Init() {


            var imageReference = new Cesium.UrlTemplateImageryProvider({
                url: 'https://api.mapbox.com/styles/v1/gismasterm2/cjqg9p2lm00442rqm4vlk89rt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA'
            });


            Cesium.Ion.defaultAccessToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjVkZDdjMC0zNWNjLTRkMTktODM0YS1lNzVkYjQwNWQzNmEiLCJpZCI6NDMyLCJpYXQiOjE1MjUyNDI1NDR9.gnm-s8YmqoAXwQTr-dT-CCQkGxe5jk_8b6xFUd1VxgY';
            map = new Cesium.Viewer('map', {

                imageryProvider: imageReference,
                timeline: false,
                navigationHelpButton: true,
                scene3DOnly: true,
                fullscreenButton: true,
                baseLayerPicker: false,
                homeButton: false,
                infoBox: true,
                sceneModePicker: false,
                animation: false,
                geocoder: false,
                sceneMode: Cesium.SceneMode.SCENE3D,
                terrainProvider: Cesium.createWorldTerrain()

            });


            map.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(2.1806, 41.4003, 15000),
                orientation: {
                    pitch: Cesium.Math.toRadians(-45.0)
                },
            });


            var overlay = map.imageryLayers;

var ortoICGC = overlay.addImageryProvider(new Cesium.createOpenStreetMapImageryProvider({
url: 'https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/',
fileExtension: 'jpeg',
maximumLevel: 19,
credit: 'Institut Cartogràfic i Geològic de Catalunya'
}));
ortoICGC.show = false;

var topoICGC = overlay.addImageryProvider(new Cesium.createOpenStreetMapImageryProvider({
url: 'https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/topo/GRID3857/',
fileExtension: 'jpeg',
maximumLevel: 19,
credit: 'Institut Cartogràfic i Geològic de Catalunya'
}));
topoICGC.show = false;

var topo2ICGC = overlay.addImageryProvider(new Cesium.createOpenStreetMapImageryProvider({
url: 'https://tilemaps.icgc.cat/mapfactory/wmts/topo_suau/CAT3857/',
fileExtension: 'png',
maximumLevel: 19,
credit: 'Institut Cartogràfic i Geològic de Catalunya'
}));
topo2ICGC.show = false;

var orto46 = overlay.addImageryProvider(new Cesium.createOpenStreetMapImageryProvider({
url: 'https://tilemaps.icgc.cat/mapfactory/wmts/orto46/CAT3857/',
fileExtension: 'png',
maximumLevel: 17,
credit: 'Institut Cartogràfic i Geològic de Catalunya'
}));
orto46.show = false;
2
$('.chk_capes').on('click', function() {
var layer = $(this).val();
var estado = $(this).prop('checked');

if (layer == 'ortoICGC') {
  ortoICGC.show = estado;
} else if (layer == 'topoICGC') {
  topoICGC.show = estado;

} else if (layer == 'topo2ICGC') {
topo2ICGC.show = estado;

} else if (layer == 'orto46') {
  orto46.show = estado;
}

}); //fin onclick


        };
    </script>
</head>

<body onload="Init()">
    <div id="capas">
        <ul>
            <li>Capas</li>
            <li>
                <input type="checkbox" value="ortoICGC" class="chk_capes"> ortoICGC
            </li>
            <li>
                <input type="checkbox" value="topoICGC" class="chk_capes"> topoICGC
            </li>
            <li>
                <input type="checkbox" value="topo2ICGC" class="chk_capes"> topo2ICGC
            </li>
            <li>
                <input type="checkbox" value="orto46" class="chk_capes"> orto46
            </li>

    </div>
    <div id="map"></div>
</body>

</html>
``` 


 
  
 
    