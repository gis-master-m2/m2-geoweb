### Ejemplos avanzados

Vamos a realizar dos aplicaciones avanzadas tanto en su complejidad com viusialización
 


#### ¿Para que no puede servir?

 * Como base para nuestra práctica final

 * Para ver la potencialidad de los estilos de mapbox

 * Para aprender nuevos métodos y funcionalidades de Mapbox GL JS

 * Para connectarnos y utlizar servicios externos

 * Para observar formas de programar y solucionar problemas
 
 * Para aprender a reutilizar código


### Visualizador de terremotos

!!! warning "Atencion!!"
    <h4>

    Nos han encargado realizar un mapa mundial para visualizar los últimos terremotos acontecidos

    * Sabemos que GeoNames.org tiene un servicio JSON para interrogar los terremotos

        [https://www.geonames.org/](https://www.geonames.org/)

    * OpenICGC tiene un estio mundial  que nos puede servir como fondo

        [https://geoserveis.icgc.cat/contextmaps/positron.json](https://geoserveis.icgc.cat/contextmaps/positron.json) 


    * El estilo de Mapbox tiene un tipo "circle" que puedo cambiar de color y tamaño

        [https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers-circle](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers-circle) 

    </h4>



#### Paso 1: Servicio GeoNames

* [Geonames.org](https://www.geonames.org/) Buscamos el servicio de terremotos y cuál es su implementación

* [https://www.geonames.org/export/JSON-webservices.html#earthquakesJSON](https://www.geonames.org/export/JSON-webservices.html#earthquakesJSON)


#### Paso 2:

 * Crearemos el archivo **terremotos.html**

 * Añadimos código con mapa base "positron" ICGC

```html
    <html>
    <head>
    <meta charset='utf-8' />
    <title>Terremotos</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css' rel='stylesheet' />
    <link href='css/estilobase.css' rel='stylesheet' />
    <script>
        var map;
        function init() {

            mapboxgl.accessToken = "";
            map = new mapboxgl.Map({
                container: 'map',
                style: 'https://geoserveis.icgc.cat/contextmaps/positron.json',
                center: [9.746, 40.473],
                zoom: 5.5,
                hash: true,
                pitch: 0,
                attributionControl: false
            });
            map.addControl(new mapboxgl.AttributionControl({
                compact: true
            }));
            map.addControl(new mapboxgl.NavigationControl());           

        } //fin init

    </script>
    </head>

    <body onload="init()">
        <div id='map'></div>
    </body>

    </html>

```

#### Paso 3:Creamos archivo JS

 * Dentro de nuestro directorio **/geoweb/js/** creamos el archivo **terremotos.js**, dónde crearemos funciones especificas de nuestro proyect  
 * Dentro de nuestro directorio **/geoweb/js/** creamos el archivo **utils.js** , dónde crearemos funciones genéricas que puedan ser reutilizadas    


#### Paso 4. Añadimos JS

 * Añadimos estos archivos (de momento vacíos) a **terremotos.html**

```html hl_lines="9 10"
    <html>
    <head>
    <meta charset='utf-8' />
    <title>Terremotos</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css' rel='stylesheet' />
    <link href='css/estilobase.css' rel='stylesheet' />
    <script src='js/utils.js'></script>
    <script src='js/terremotos.js'></script>
    
    <script>
        var map;
        function init() {

            mapboxgl.accessToken = "";
            map = new mapboxgl.Map({
                container: 'map',
                style: 'https://geoserveis.icgc.cat/contextmaps/positron.json',
                center: [9.746, 40.473],
                zoom: 5.5,
                hash: true,
                pitch: 0,
                attributionControl: false
            });
            map.addControl(new mapboxgl.AttributionControl({
                compact: true
            }));
            map.addControl(new mapboxgl.NavigationControl());           

        } //fin init

    </script>
    </head>

    <body onload="init()">
        <div id='map'></div>
    </body>

    </html>

```

#### Paso 5: función genérica GET

 * Creamos una función genérica para enviar y recibir respuesta de cualquier servicio GET que retorne un JSON  dentro de **utils.js**

```javascript

 async function enviarPeticion(url) {

  return fetch(url)
      .then(function (response) {
          return response.json()
      })
      .then(function (data) {
          //console.log('Respuesta', data);
          return data;
      }).catch(function (error) {
          console.log('Error', error);
          alert("Error peticion");
          return null;
      });

}

```

#### Paso 6 :convertir la respuesta de JSON GeoNames al formato GeoJSON

 * Creamos una función para convertir la respuesta de JSON GeoNames al formato GeoJSON en **terremotos.js**
 * Miramos web [https://geojson.io](https://geojson.io)

```javascript

 function terremotosGeonamesToGeoJSON(respuestaGeonames){

    var geoJSON ={
        "type": "FeatureCollection",
        "features": []
    };

    for (var i =0; i < respuestaGeonames.earthquakes.length; i++){

        geoJSON.features.push(
            {
                "type": "Feature",
                "properties": {"magnitude":respuestaGeonames.earthquakes[i].magnitude,
                                "datetime":respuestaGeonames.earthquakes[i].datetime },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    respuestaGeonames.earthquakes[i].lng,
                    respuestaGeonames.earthquakes[i].lat
                  ]
                }
              }
        );

    } //fin loop

    return geoJSON;

    } //fin funcion

```

#### Paso 7 : Función generarPeticionTerremotos()

 * Vamos a añadir otra funcion dentro **terremotos.js** de para: 
    * Capturar las coordenadas de mapa (BoundigBox)
    * Crear la petición a Geonames
    * Enviar petición
    * Capturar la respuesta y convertirla a GeoJSON
    * Generar Source y Layer de Mapbox Style y añadir datos

!!! warning "Justo debajo toda de la función terremotosGeonamesToGeoJSON()  añadimos""

```javascript

 function generarPeticionTerremotos() {

    var peticion = 'https://secure.geonames.org/earthquakesJSON?' +
        'north=' + map.getBounds()._ne.lat + '&' +
        'south=' + map.getBounds()._sw.lat + '&' +
        'east=' + map.getBounds()._ne.lng + '&' +
        'west=' + map.getBounds()._sw.lng + '&' +
        'maxRows=50&' +
        'minMagnitude=5&' +
        'username=masterupc&';

    enviarPeticion(peticion).then(function (respuestaGeonames) {

        var geoJSON = terremotosGeonamesToGeoJSON(respuestaGeonames);

        if (map.getSource("terremotos_source")) {

            map.getSource("terremotos_source").setData(geoJSON);

        } else {

            map.addSource("terremotos_source", {
                type: "geojson",
                data: geoJSON
            });

            map.addLayer({
                'id': 'terremotos',
                'type': 'circle',
                'source': 'terremotos_source',
                'paint': {
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'magnitude'],
                        3, '#ebe709',
                        5, '#eb1809',
                        7, '#ef4bf2',
                    ],
                    'circle-opacity': 0.75,
                    'circle-radius': [
                        'interpolate',
                        ['linear'], ['get', 'magnitude'],
                        3, 8,
                        5, 16,
                        8, 32
                    ]
                }
            });

            map.addLayer({
                'id': 'terremotos-textos',
                'type': 'symbol',
                'source': 'terremotos_source',
                'layout': {
                    'text-field': [                            
                        'format', ['get', 'magnitude'],                               
                    ],
                    "text-font": [
                        "FiraSans-Italic"
                    ],
                    'text-size': 10
                },
                'paint': {
                    'text-color': 'rgba(0,0,0,1)'
                }
            });

        }

    });

} // fin funcion

```

#### Paso 8:La función **generarPeticionTerremotos()**

* La función **generarPeticionTerremotos()** és la función principal que necesitamos que se ejecute:

    * Al cargar el mapa (evento `load`)
    * Cada vex que me muevo por el mapa (eventos `moveend` y `zoomend`)

```html hl_lines="30 31 32 33 34 35 36 37 38 39 40 41 42 43 44"

    <html>
    <head>
    <meta charset='utf-8' />
    <title>Terremotos</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css' rel='stylesheet' />
    <link href='css/estilobase.css' rel='stylesheet' />
    <script src='js/utils.js'></script>
    <script src='js/terremotos.js'></script>
    <script>
        var map;
        function Init() {

            mapboxgl.accessToken = '';
            map = new mapboxgl.Map({
                container: 'map',
                style: 'https://geoserveis.icgc.cat/contextmaps/positron.json',
                center: [9.746, 40.473],
                zoom: 5.5,
                hash: true,
                pitch: 0,
                attributionControl: false
            });
            map.addControl(new mapboxgl.AttributionControl({
                compact: true
            }));
            map.addControl(new mapboxgl.NavigationControl());

            map.on("load", function () {

                generarPeticionTerremotos();

            }); // fin load mapa

            map.on("zoomend", function () {

                generarPeticionTerremotos();
            });

            map.on("moveend", function () {

                generarPeticionTerremotos();
            });


        } //fin init

    </script>
    </head>

    <body onload="Init()">
    <div id='map'></div>
    </body>

    </html>

```

#### Paso 9:función para generar popups

* Dentro del archivo  **utils.js**  añadimos una función para generar popups:


```javascript

function addPopupToMap(nombreCapa) {

  map.on('click', nombreCapa, function (e) {

    var text = "";
    //console.info(e);
    for (key in e.features[0].properties) {

      text += "<b>" + key + "</b>:" + e.features[0].properties[key] + "<br>";
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

#### Paso 10: Llamamos a la funcion **addPopupToMap()**

* Llamamos a la funcion **addPopupToMap()** pasando el nombre de nuestra capa activa:

  
```html hl_lines="33"

    <html>
    <head>
    <meta charset='utf-8' />
    <title>Terremotos</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css' rel='stylesheet' />
    <link href='css/estilobase.css' rel='stylesheet' />
    <script src='js/utils.js'></script>
    <script src='js/terremotos.js'></script>
    <script>
        var map;
        function Init() {

            mapboxgl.accessToken = '';
            map = new mapboxgl.Map({
                container: 'map',
                style: 'https://geoserveis.icgc.cat/contextmaps/positron.json',
                center: [9.746, 40.473],
                zoom: 5.5,
                hash: true,
                pitch: 0,
                attributionControl: false
            });
            map.addControl(new mapboxgl.AttributionControl({
                compact: true
            }));
            map.addControl(new mapboxgl.NavigationControl());

            map.on("load", function () {

                generarPeticionTerremotos();
                addPopupToMap("terremotos");

            }); // fin load mapa

            map.on("zoomend", function () {

                generarPeticionTerremotos();
            });

            map.on("moveend", function () {

                generarPeticionTerremotos();
            });


        } //fin init

    </script>
    </head>

    <body onload="Init()">
    <div id='map'></div>
    </body>

    </html>

```


!!! tip "¿Añadimos Titulo?"


!!! success "¿Subimos el ejemplo al GitHub?"
	
	```bash

		git pull
        git add .
        git commit -m "terremotos"
        git push

	```   

### Visualizador de edificios catastro BCN

!!! warning "Atencion!!"
    <h4>

    Nos han encargado realizar un mapa para visualizar edificios de Barcelona

    * Sabemos que la direccion Direccion General de Catastro ofrece servicio de descarga de edificios
    
        [http://www.catastro.minhap.es/webinspire/index.html](http://www.catastro.minhap.es/webinspire/index.html)
    

    * OpenICGC tiene un estio mundial  que nos puede servir como fondo

        [https://geoserveis.icgc.cat/contextmaps/icgc.json](https://geoserveis.icgc.cat/contextmaps/icgc.json) 

    * Mapbox tiene un estio mundial oscuro que también nos puede servir como fondo

        [mapbox://styles/mapbox/dark-v10](mapbox://styles/mapbox/dark-v10) 

    * El estilo de Mapbox tiene un tipo "fill-extrusion" que puedo cambiar de color y extrudir geometrias

        [https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers-fill-extrusion](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers-fill-extrusion) 

    </h4>


#### Paso 1: Convertir edificios Catastro

    * Descargamos datos [http://www.catastro.minhap.es/INSPIRE/Buildings/08/08900-BARCELONA/A.ES.SDGC.BU.08900.zip](http://www.catastro.minhap.es/INSPIRE/Buildings/08/08900-BARCELONA/A.ES.SDGC.BU.08900.zip)

   * Convertimos el archivo **A.ES.SDGC.BU.08900.buildingpart.gml** a  GeoJSON  "contrucciones.geojson" con QGIS

   * Lo cargamos como Tileset dentro de MapBox.com

#### Paso 2:

 * Crearemos el archivo **edificios.html**

 * Añadimos ya los JS pròpios

```html
    <html>
    <head>
    <meta charset='utf-8' />
    <title>Edificios</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css' rel='stylesheet' />
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
            "url": "mapbox://gismasterm2.47fz7naw"  // Nuestor ID Tileset

        }); //fin map source


        map.addLayer({
        "id": "edificios",
        "type": "fill-extrusion",
        "source": "edificios_source",
        "source-layer": "contrucciones-2558vn", // Nuestro nombre Tileset
        "maxzoom": 21,
        "minzoom": 15,
       // "filter": [">", "numberOfFloorsAboveGround", 0],
        "paint": {
            "fill-extrusion-color": [
                "interpolate", ["linear"], ["number", ["get", "numberOfFloorsAboveGround"]],
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
                14, ["*", 1, ["to-number", ["get", "numberOfFloorsAboveGround"]]],
                16, ["*", 1.5, ["to-number", ["get", "numberOfFloorsAboveGround"]]],
                20, ["*", 2, ["to-number", ["get", "numberOfFloorsAboveGround"]]]
            ],
            "fill-extrusion-opacity": 0.9
        }
    });		// fin addLayer	capa texto "water-name-lakeline-platja", "road-label"

}

```
    

!!! tip "Añadimos filtro y orden de capas para una mejor visualización"


#### Paso 4: Llamamos funciones en el evento load de map

 * Llamamos a la función **addEdificiosCapa()**

 * Reutilizamos código !! y también llamamos a la función de crear popup **addPopupToMap**

``` html hl_lines="31 32 33 34 35 36"
    <html>

    <head>
    <meta charset='utf-8' />
    <title>Edificios</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css' rel='stylesheet' />
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
    
    <div id="map"></div>
    </body>

    </html>

```

#### Paso 5: Opciones de filtro

 * Vamos a crear una funcionalidad para filtrar edificios según su altura

 * Creamos un elementos HTML de tipu `input:range` para poder filtrar


```html hl_lines="43 44 45 46 47"
    <html>

    <head>
    <meta charset='utf-8' />
    <title>Edificios</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css' rel='stylesheet' />
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
        <h5>Altura edificios</h5>
        <label id="altura">Altura superior a 0 m</label>
        <input id="slider" type="range" min="1" max="110" step="5" value="0" />
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

#### Paso 4: Función de filtro

 * Añadimos a  **edificios.js** la funcion **filtrarEdificios()**

``` javascript
    function filtrarEdificios(valor) {
        map.setFilter("edificios", [">", "numberOfFloorsAboveGround", parseInt(valor)]);

        document.getElementById("altura").innerHTML = "Altura superior a " + valor + "m.";

    }
```


#### Paso 4: Evento onChange

* LLamamos a la función de desde el evento `onChange` del objeto input de HTML


```html hl_lines="46"
    <html>

    <head>
    <meta charset='utf-8' />
    <title>Edificios</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css' rel='stylesheet' />
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
        <h5>Altura edificios</h5>
        <label id="altura">Altura superior a 0 m</label>
        <input  onChange="filtrarEdificios(this.value)" id="slider" type="range" min="1" max="110" step="5" value="0" />
    </div>
    <div id="map"></div>
    </body>

    </html>

```

!!! tip "Activar/ desactivar capa via código"

```javascript

    map.setLayoutProperty("edificios", "visibility", "visible");
    map.setLayoutProperty("edificios", "visibility", "none");
```


!!! tip "Popup personalizado"

```javascript

function addPopupToMapEdificios(nombreCapa) {

    map.on('click', nombreCapa, function (e) {

        var text = "";
        //console.info(e);
        for (key in e.features[0].properties) {

            if (key == "numberOfFloorsAboveGround") {
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


!!! tip "¿Ponemos título?"


!!! success "¿Subimos el ejemplo al GitHub?"
	
	```bash

		git pull
        git add .
        git commit -m "terremotos"
        git push

	``` 