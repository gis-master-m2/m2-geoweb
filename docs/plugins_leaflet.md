

 
### 5. Plugins Leaflet

Gracias a ser un proyecto de código abierto y de las aportaciones de los usuarios,
Leaflet tiene más de 250 plugins o "pequeñas aplicaciones" que añaden funcionalidades a la libreria.
 
* 
 Plugins
  [http://leafletjs.com/plugins.html](http://leafletjs.com/plugins.html){target=_blank}


!!! success página de plugins
     Visitamos la página de plugins y miramos ejemplos


#### ¿Cómo utilizar un Plugin?

 * 1-Primero debemos buscar en la página de plugins si existe alguno que nos ayude a solucionar nuestro problema o necesidad

 * 2-Entraremos en la página GIT del plugin y leeremos su documentación. Atencion !! A veces la documentación pueder ser poca y confusa

 * 3.1- Si existe una versión on-line del plugin (URL en CDN), la invocaremos en nuestra aplicación directamente (mejor opción)

 * 3.2- Si existe una página de demo podemos mediante crtl+u ver código fuente la url del plugin

 * 3.3- Si no existe, descargaremos los archivos del plugin - son *.js, pero tambień pueden ser *.css e imagenes - normalmente se encuentran en los directorios **/dist** o **/src** y los guardaremos en nuestro proyecto.




### Ejemplo añadir plugin OSM Geocoder
  > Plugin que permite connectar con servicios de Geocodificaciónde OSM

 *  Plugin [https://github.com/k4r573n/leaflet-control-osm-geocoder](Leaflet Control OSM Geocoder){target=_blank}  
 
*  Creamos archivo **leaflet-plugin.html** dentro de nuestro directorio **/geoweb**

```html
  <html lang="es">
    <head>
    <title>Leaflet ejemplo plugin</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="author" content="autor"/>
      <meta name="description" content="descripción página">
      <meta name="robots" content="index,follow">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <!--Plugin OSMGeocode -->
      <!--si descargamos 3.3 -->
      <!--<script src="js/Control.OSMGeocoder.js"></script>-->
   <!--<link rel="stylesheet" href="js/Control.OSMGeocoder.css" />-->

  <!--si añadimos directamente 3.1-->
	<script src="https://rawgit.com/k4r573n/leaflet-control-osm-geocoder/master/Control.OSMGeocoder.js"></script>
	<link rel="stylesheet" href="https://rawgit.com/k4r573n/leaflet-control-osm-geocoder/master/Control.OSMGeocoder.css" />
      
      
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
            var map,capa1;
            function init(){
                map = L.map("map",{
                center:[41.6863, 1.8382],
                zoom:8
                });
                capa1= L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                maxZoom : 19,
                minZoom : 1,
                attribution : "OSM"
                });
                capa1.addTo(map);
                //añadir plugin
                var osmGeocoder = new L.Control.OSMGeocoder({placeholder: 'Buscar lugar...'});
		            map.addControl(osmGeocoder);
               
            }
            </script>
    </head>
    <body onLoad="init()">
        <div id="map"></div>
    </body>
    </html>
```
       
![alt text](img/leaflet-plugins.png "vscode")


!!! success "¿Editamos index.html Subimos el ejemplo al GitHub?"
	
	```bash

		git pull
        git add .
        git commit -m "plugins leaflet"
        git push

	```    
