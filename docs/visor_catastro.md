

### Descripción 

 Nos han encargado realizar un mapa para visualizar edificios de Barcelona

* Sabemos que la direccion Direccion General de Catastro ofrece servicio de descarga de edificios
    
    [http://www.catastro.minhap.es/webinspire/index.html](http://www.catastro.minhap.es/webinspire/index.html){target=_blank}
    
* Sabemos también que existe un plugin de QGIS para hacer una descarga más fácil el "Spanish Inspire Catastral Downloader"

* OpenICGC tiene un estio mundial  que nos puede servir como fondo

    [https://geoserveis.icgc.cat/contextmaps/icgc.json](https://geoserveis.icgc.cat/contextmaps/icgc.json){target=_blank}

* Mapbox tiene un estio mundial oscuro que también nos puede servir como fondo

    [mapbox://styles/mapbox/dark-v10](mapbox://styles/mapbox/dark-v10){target=_blank} 

* En la specificació de Style de Mapbox los polígono tienen tienen la paint propertie "fill-extrusion" dónde que puedo cambiar de color y extrudir geometrias

    [https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers-fill-extrusion](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers-fill-extrusion){target=_blank} 

    

### Paso 1: Preparamos datos

   * La carga de datos dentro de Mapbox puede ser lenta sobretodo si tenemos algún dataset pesado

   * Vamos cargar todas las construcciones de Barcelona (321 mil polígonos) que ofrece la Direccion General de Catastro [http://www.catastro.minhap.es/webinspire/index.html](http://www.catastro.minhap.es/webinspire/index.html){target=_blank}  

   * Descargaríamos datos directamente [http://www.catastro.minhap.es/INSPIRE/Buildings/08/08900-BARCELONA/A.ES.SDGC.BU.08900.zip](http://www.catastro.minhap.es/INSPIRE/Buildings/08/08900-BARCELONA/A.ES.SDGC.BU.08900.zip) o utilizaríamos QGIS + complemento "Spanish Inspire Catastral Downloader"

   * Convertiríamos el archivo **A.ES.SDGC.BU.08900.buildingpart.gml** a SHP  "contrucciones.shp" con QGIS (coordenadas lat/lon EPSG:4326)

    !!! success "Descargar archivo ya convertido [contrucciones.zip](datos/construcciones.zip)"

    !!! warning "No guardeís el archivo dentro de **/geoweb**"

   * Lo cargamos como Tileset dentro de MapBox, añadimos **contrucciones.zip** SIN DESCOMPRIMIR

   ![alt text](img/mapbox-catastro.png "mapbox-catastro.png")

#### Paso 2:Crear edificios.html


!!! warning "En este ejemplo vamos a reutilizar el archivo creado en la seccion 2 **/geoweb/css/estilobase.css**"

    El archivo **estilobase.css** es este

```css
            body {
                margin: 0;
            }

            #map {
                height: 100%;
                width: 100%;
                background-color: #ffffff
            }

```
* Vamos a VSCode y creamos el archivo **edificios.html** dentro de **/geoweb**

```html
    <html>
    <head>
    <meta charset='utf-8' />
    <title>Edificios</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css' rel='stylesheet' />
    <link href='css/estilobase.css' rel='stylesheet' />
 
    <script src='js/edificios.js'></script>
    <script>
        //Añadir vuestor token y/o estilo !!
        var map;
        function init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
             map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/dark-v10',
                center: [2.16859, 41.3954],
                zoom: 15,
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

#### Paso 3: Creamos archivo JS

 * Dentro de nuestro directorio **/geoweb/js/** creamos el archivo **edificios.js**, dónde crearemos funciones especificas de nuestro proyecto  

 * Creamos la función **addEdificiosCapa()**

```javascript

   function addEdificiosCapa() {

    map.addSource("edificios_source", {
        "type": "vector",
        "url": "mapbox://gismasterm2.2gkan1gt"  // Nuestor ID Tileset

    }); //fin map source


    map.addLayer({
    "id": "edificios",
    "type": "fill-extrusion",
    "source": "edificios_source",
    "source-layer": "construcciones-324xyz", // Nuestro nombre Tileset
    "maxzoom": 21,
    "minzoom": 15,
   // "filter": [">", "numberOfFl", 0],
    "paint": {
        "fill-extrusion-color": [
            "interpolate", ["linear"], ["number", ["get", "numberOfFl"]],
            0, "#FFFFFF",
            1, "#e6b03d",
            3, "#e6b03d",
            6, "#3de66d",
            9, "#3de6b1",
            12, "#22ecf0",
            15, "#14b1fd",
            20, "#3d73e6",
            40, "#123a8f",
            60, "#ce2f7e",
            106, "#ff4d4d"

        ],
        "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8, 0,
            12.5, 0,
            14, ["*", 1, ["to-number", ["get", "numberOfFl"]]],
            16, ["*", 1.5, ["to-number", ["get", "numberOfFl"]]],
            20, ["*", 2, ["to-number", ["get", "numberOfFl"]]]
        ],
        "fill-extrusion-opacity": 0.9
    }
}
//,"road-label"
);	

} //fin funcion

```
    

#### Paso 4: Llamamos funciones en el evento load de map

 * Llamamos a la función **addEdificiosCapa()**


``` html hl_lines="31 32 33 34 35 36"
    <html>

    <head>
    <meta charset='utf-8' />
    <title>Edificios</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css' rel='stylesheet' />
    <link href='css/estilobase.css' rel='stylesheet' />

    <script src='js/edificios.js'></script>
    <script>
        //Añadir vuestor token y/o estilo !!
        var map;
        function init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
             map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/dark-v10',
                center: [2.16859, 41.3954],
                zoom: 15,
                attributionControl: false,
                pitch: 45,
                hash: true
            });

            map.addControl(new mapboxgl.AttributionControl({ compact: true }));
            map.addControl(new mapboxgl.NavigationControl());
           
            map.on('load', function () {
                
                addEdificiosCapa();

    
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


!!! tip "Descomentamos filtro y orden de capas para una mejor visualización en **edificios.js** ¿Que ha cambiado?"

```javascript hl_lines="17 47"

   function addEdificiosCapa() {

    map.addSource("edificios_source", {
        "type": "vector",
        "url": "mapbox://gismasterm2.2gkan1gt"  // Nuestor ID Tileset

    }); //fin map source


    map.addLayer({
    "id": "edificios",
    "type": "fill-extrusion",
    "source": "edificios_source",
    "source-layer": "construcciones-324xyz", // Nuestro nombre Tileset
    "maxzoom": 21,
    "minzoom": 14,
   "filter": [">", "numberOfFl", 0],
    "paint": {
        "fill-extrusion-color": [
            "interpolate", ["linear"], ["number", ["get", "numberOfFl"]],
            0, "#FFFFFF",
            1, "#e6b03d",
            3, "#e6b03d",
            6, "#3de66d",
            9, "#3de6b1",
            12, "#22ecf0",
            15, "#14b1fd",
            20, "#3d73e6",
            40, "#123a8f",
            60, "#ce2f7e",
            106, "#ff4d4d"

        ],
        "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8, 0,
            12.5, 0,
            14, ["*", 1, ["to-number", ["get", "numberOfFl"]]],
            16, ["*", 1.5, ["to-number", ["get", "numberOfFl"]]],
            20, ["*", 2, ["to-number", ["get", "numberOfFl"]]]
        ],
        "fill-extrusion-opacity": 0.9
    }
}
,"road-label"
);	

} //fin funcion

```

#### Paso 5: Opciones de filtro

 * Vamos a crear una funcionalidad para filtrar edificios según su número de pisos

 * Creamos un elementos HTML de tipo `input:range` para poder filtrar


```html hl_lines="43 44 45 46 47"
    <html>

    <head>
    <meta charset='utf-8' />
    <title>Edificios</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css' rel='stylesheet' />
    <link href='css/estilobase.css' rel='stylesheet' />

    <script src='js/edificios.js'></script>
    <script>
        //Añadir vuestor token y/o estilo !!
        var map;
        function init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
             map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/dark-v10',
                center: [2.16859, 41.3954],
                zoom: 15,
                attributionControl: false,
                pitch: 45,
                hash: true
            });

            map.addControl(new mapboxgl.AttributionControl({ compact: true }));
            map.addControl(new mapboxgl.NavigationControl());
           
            map.on('load', function () {
                
                addEdificiosCapa();


             }); //fin onload
            
        } // final init
    </script>
    </head>

    <body onload="init()">
    <div class="panelTopIzquierda">

        <label id="altura">Más de 0 pisos</label>
        <input id="slider" type="range" min="1" max="50" step="1" value="0" />
    </div>
    <div id="map"></div>
    </body>

    </html>

```

 * Añadimos a **estilobase.css** las siguientes clases

```css

.panelTopIzquierda {
    position: absolute;
    top: 45px;
    left: 20px;
    width: 200px;
    z-index: 1000;
    background-color: rgba(255,255,255,0.9);
    padding: 10px;
    font-size:20px;
    color: #333333;
    border-radius: 5px;
}

.panelTopIzquierda label{
    font-size:0.85em;
}

.panelTopIzquierda input{
    cursor:pointer;
    width: 95%;
}

```

#### Paso 6: Función de filtro

 * Añadimos a  **edificios.js** la funcion **filtrarEdificios()**

``` javascript
    function filtrarEdificios(valor) {
        map.setFilter("edificios", [">", "numberOfFl", parseInt(valor)]);

        document.getElementById("altura").innerHTML = "Más de  <b>" + valor + "</b> pisos";

    }
```


#### Paso 7: Evento onChange

* LLamamos a la función de desde el evento `onChange` del objeto input de HTML


```html hl_lines="46"
    <html>

    <head>
    <meta charset='utf-8' />
    <title>Edificios</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css' rel='stylesheet' />
    <link href='css/estilobase.css' rel='stylesheet' />
    <script src='js/utils.js'></script>
    <script src='js/edificios.js'></script>
    <script>
        //Añadir vuestor token y/o estilo !!
        var map;
        function init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
             map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/dark-v10',
                center: [2.16859, 41.3954],
                zoom: 15,
                attributionControl: false,
                pitch: 45,
                hash: true
            });

            map.addControl(new mapboxgl.AttributionControl({ compact: true }));
            map.addControl(new mapboxgl.NavigationControl());
           
            map.on('load', function () {
                
                addEdificiosCapa();

                addPopupToMap("edificios");
             }); //fin onload
            
        } // final init
    </script>
    </head>

    <body onload="init()">
    <div class="panelTopIzquierda">

       <label id="altura">Más de 0 pisos</label>
        <input  onChange="filtrarEdificios(this.value)" id="slider" type="range" min="1" max="50" step="1" value="0" />
    </div>
    <div id="map"></div>
    </body>

    </html>

```

!!! example "Activar/ desactivar capa via código"

```javascript

    map.setLayoutProperty("edificios", "visibility", "visible");
    map.setLayoutProperty("edificios", "visibility", "none");
```


!!! success "Añadir funcion Popup personalizado dentro de edificios.js"

```javascript

function addPopupToMapEdificios(nombreCapa) {

    map.on('click', nombreCapa, function (e) {

        var text = "";
        //console.info(e);
        for (key in e.features[0].properties) {

            if (key == "numberOfFl") {
                text += "<b>Numero de plantas</b>:" + e.features[0].properties[key] + "<br>";
            }
            if (key == "localId") {
                //localId 0004702DF3800C_part1
                //http://ovc.catastro.meh.es/OVCServWeb/OVCWcfLibres/OVCFotoFachada.svc/RecuperarFotoFachadaGet?ReferenciaCatastral=0004701DF3800C
                //https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?rc1=0004701&rc2=DF3800C

                var localId = e.features[0].properties[key];

                var localIdSplit = localId.split("_"); // 0004702DF3800C  part1
                var parte1 = localIdSplit[0].substring(0, 7);
                var parte2 = localIdSplit[0].substring(7, localIdSplit[0].length);
                text += "<img width=200 src=http://ovc.catastro.meh.es/OVCServWeb/OVCWcfLibres/OVCFotoFachada.svc/RecuperarFotoFachadaGet?ReferenciaCatastral=" + localId + "><br>";
                text += "<a target=blank href=https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?rc1=" + parte1 + "&rc2=" + parte2 + ">Ficha</a><br>";

            }


        }
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(text)
            .addTo(map);

    });

    map.on('mouseenter', nombreCapa, function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', nombreCapa, function () {
        map.getCanvas().style.cursor = '';
    });

}

```
 ![alt text](img/mapbox-catastro-mapa.png "mapbox-catastro-mapa.png")

!!! tip "Geocodificador Mapbox GL  https://github.com/mapbox/mapbox-gl-geocoder/blob/master/API.md"

```html hl_lines="9 10 33 34 35 36 37"
    <html>

    <head>
    <meta charset='utf-8' />
    <title>Edificios</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css' rel='stylesheet' />
    <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.4.2/mapbox-gl-geocoder.min.js"></script>
    <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.4.2/mapbox-gl-geocoder.css" type="text/css"/>
    <link href='css/estilobase.css' rel='stylesheet' />
  
    <script src='js/edificios.js'></script>
    <script>
        //Añadir vuestor token y/o estilo !!
        var map;
        function init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA';
             map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/dark-v10',
                center: [2.16859, 41.3954],
                zoom: 15,
                attributionControl: false,
                pitch: 45,
                hash: true
            });

            map.addControl(new mapboxgl.AttributionControl({ compact: true }));
            map.addControl(new mapboxgl.NavigationControl());

            map.addControl(
                new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
                }));
           
            map.on('load', function () {
                
                addEdificiosCapa();

                addPopupToMapEdificios("edificios");
             }); //fin onload
            
        } // final init
    </script>
    </head>

    <body onload="init()">
   <div class="panelTopIzquierda">

       <label id="altura">Más de 0 pisos</label>
        <input  onChange="filtrarEdificios(this.value)" id="slider" type="range" min="1" max="50" step="1" value="0" />
    </div>
    <div id="map"></div>
    </body>

    </html>

```


 

!!! tip "¿Ponemos título?"


!!! success "¿Subimos el ejemplo al GitHub?"
	
	```bash

		git pull
        git add .
        git commit -m "visor catastro"
        git push

	``` 