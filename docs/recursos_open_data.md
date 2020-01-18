
# Recursos open data

### [Ver presentación OpenData](presentacion/opendata.pptx)


### Ejemplo API CKAN

El API de CKAN http://docs.ckan.org/en/latest/api/index.html no ofrece diferetes niveles y métodos para poder buscar y filtrar datasets.

 
En este ejemplo utilizaremos el método [resource_search](http://docs.ckan.org/en/latest/api/index.html#ckan.logic.action.get.resource_search) para buscar datasets en cualquier portal de CKAN

  

Para buscar en portales CKAN necesitamos saber la URL del portal , exemplo http://demo.ckan.org y añadir el path del método a utilizar **/api/3/action/resource_search?**

 
http://demo.ckan.org/api/3/action/resource_search?

 
 
#### Creación de un buscador

  
* Dentro de nuestor espacio de trabajo creamos un archivo con el nombre de *ckan.html*.

* Abrimos el archivo *ckan.html* con un editor de texto y copiamos el siguiente código.


```html
 <!DOCTYPE html>
  <html>
<head>
    <meta charset="UTF-8">
    <title>
            Bàsic sample Resource Search API CKAN
    </title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <style>
            #results {
                    width: 100%;
                    background-color: #f2f2f2;
                    margin: 5px;
            }
    </style>
</head>
<body>
</body>
</html>

```

*  Abrimos el archivo *ckan.html* en el navegador.

*  Añadimos dentro del tag  ```<body>``` la maquetación HTML

  
```html

<div class="container">
  <h3>Resource Search example </h3>
  <p> Package Search <br>
    <a target="_blank" href="http://docs.ckan.org/en/latest/api/">http://docs.ckan.org/en/latest/api/</a>
  </p>
     <form id="_form">
    <div class="form-group">
      <label for="url_ckan">Url:</label>

      <select id="url_ckan">
        <option value="http://demo.ckan.org/api/3/action/resource_search?">ckan.org</option>
				<option value="http://old.datahub.io/api/3/action/resource_search?">old.datahub.io</option>
				 <option value="http://dadesobertes.seu-e.cat/api/action/resource_search?">Dades Obertes aoc</option>
				<!-- añadimos BCN opendata -->
      </select>
    </div>
    <div class="form-group">
      <label for="text_filter_ckan"> Filter <u>(name, descripton, format )</u></label>
      <input type="text" class="form-control" id="text_filter_ckan" value="name:wifi" placeholder="text filter">
    </div>
  </form>
  <form class="form-inline">
    <div class="form-group">
      <label for="num_results_ckan">Num results</label>
      <input type="number" size="3" class="form-control" id="num_results_ckan" value="5">
    </div>

  </form>
  <form>
    <div class="form-group">
      <button id="bt_send" type="button" class="btn btn-default btn-success">Send</button>
    </div>
  </form>
  <hr>
  <div id="results"></div>
  <div id="mygrid" style="height: 500px"></div>
</div>

```
  

* Abrimos el archivo *ckan.html* en el navegador.
  

* Añadimos just encima del tag ```</head>``` el siguiente código javascript

  
```javascript
<script>
    $.ajaxSetup({
    cache: true
  });
  $(document).ready(function () {
    $('#bt_send').on('click', function () {
      sendRequest();
    });

    $( "#_form" ).submit(function( event ) {
      sendRequest();
      event.preventDefault();
    });


    function sendRequest(){
      var data = {
        rows: $('#num_results_ckan').val(),
        query: $('#text_filter_ckan').val()
      };
$.ajax({
url: $('#url_ckan').val(),
data: data,
dataType: 'jsonp',
success: function (data) {
  if (data.success) {
    $('#results').html('Total results found: ' + data.result.count);
    $('#mygrid').html('');

    if (data.result.count >= 1) {
      $('#mygrid').append('<ul>');
      $.each(data.result.results, function (index, value) {
        $('#mygrid').append('<li>' + value.name + ': <a href="' + value.url + '">' + value.url +
          '</a>');

        $('#mygrid').append('</li>');
      });
      $('#mygrid').append('</ul>');

    }

  } else {
    $('#results').html("An error occured: " + data.error.message);
  }
},
error: function (xhr) {
  $('#results').html("An error occured: " + xhr.status + " " + xhr.statusText);
}

});
    }

});
</script>

```
  

* Abrimos pàgina *ckan.html* y lanzamos búsquedas

  
!!! note
    **Ejercicio 1**: Añadir una o más URLs de otros portales de CKAN, por ejemplo OpenDataBCN
  
!!! note
    **Ejercicio 2**: ¿Cómo haríamos para qué en los resultados apareciera la fecha de creación del dato?

!!! note
    **Ejercicio 3**: Descargamos CSV accidentes
  

### Ejemplos API SOCRATA


El API de Socrata https://dev.socrata.com no ofrece diferetes niveles y métodos para poder buscar y filtra datasets.

  

En este primer ejemplo utilizaremos la **Discovery API** https://socratadiscovery.docs.apiary.io/ para buscar datasets en cualquier portal de Socrata



#### Creación de un buscador
  

* Creamos un archivo con el nombre de **socrata.html**.

* Abrimos el archivo *socrata.html* con un editor de texto y copiamos el siguiente código.

  
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>
        Basic sample API Discovery SOCRATA
    </title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <style>
        #results {
            width: 100%;
            background-color: #f2f2f2;
            margin: 5px;
        }
    </style>
</head>

<body>

</body>

</html>

```
  

* Abrimos el archivo socrata.html en el navegador.

  

* Añadimos dentro del tag * ```<body>```* la maquetación HTML.

  
```html

<div class="container">
<h3>SOCRATA Resource Search example </h3>
<p>Discovery API <br>
  <a target="_blank" href="http://docs.socratadiscovery.apiary.io">http://docs.socratadiscovery.apiary.io</a>
</p>
<form>
  <div class="form-group">
	<div class="radio">
	  <label>
			<input type="radio" name="optionsRadios" id="optionsRadios1" value="https://api.eu.socrata.com/api/catalog/v1" checked>
			EU API Discovery
	  </label>
	</div>
	<div class="radio">
	  <label>
			<input type="radio" name="optionsRadios" id="optionsRadios2" value="https://api.us.socrata.com/api/catalog/v1">
		   US API Discovery
	  </label>
	</div>
  </div>
  <div class="form-group">
	<label for="text_filter_socrata"> Filter <u></u></label>
	<input type="text" class="form-control" id="text_filter_socrata" value="Contracts" placeholder="text filter">
  </div>
</form>
<form class="form-inline">
  <div class="form-group">
	<label for="num_results_socrata">Num results</label>
	<input type="number" size="3" class="form-control" id="num_results_socrata" value="25">
  </div>

</form>
<form>
  <div class="form-group">
	<button id="bt_send" type="button" class="btn btn-default btn-success">Send</button>
  </div>
</form>
<hr>
<div id="results"></div>
<div id="mygrid" style="height: 500px"></div>
</div>

```
  

* Abrimos el archivo **socrata.html** en el navegador.

  

* Añadimos just encima del tag ```</head>``` el siguiente código javascript

  
```javascript

<script>
$.ajaxSetup({
  cache: true
});
$(document).ready(function() {
  $('#bt_send').on('click', function() {
	sendRequest();
  });

  $('#text_filter_socrata').on('keypress', function(event) {
	if (event.which == 13) {
	  sendRequest();
	  event.preventDefault();
	}
  });

  function sendRequest() {
	var _data = {
	  q: $('#text_filter_socrata').val(),
	  limit: $('#num_results_socrata').val()
	};
	$.ajax({
	  url: $('input:radio[name=optionsRadios]:checked').val(),
	  data: _data,
	  method: 'GET',
	  dataType: 'json',
	  success: function(data) {
		console.info(data);
		if (data) {
		  $('#results').html('Total results found: ' + data.resultSetSize);
		  $('#mygrid').html('');

		  if (data.resultSetSize >= 1) {
			$('#mygrid').append('<ul>');
			$.each(data.results, function(index, value) {
			  $('#mygrid').append('<li><b>' + value.resource.name + '</b>(' + value.resource.type + '): <a target="_blank" href="' + value.link + '">' + value.link + '</a>');
			  $('#mygrid').append('</li>');
			});
			$('#mygrid').append('</ul>');
		  }
		} else {
		  $('#results').html("An error occured:");
		}
	  },
	  error: function(xhr) {
		$('#results').html("An error occured: " + xhr.status + " " + xhr.statusText);
	  }
	});
  }
});
</script>

```
  

* Abrimos pàgina socrata.html y lanzamos búsquedas

  
!!! note
    **Ejercicio 1**: ¿Cómo filtraríamos para qué sólo enseñara "assets" de tipo "map", **only:map**?


  
  

#### Socrata y Leaflet: Mapificación de resultados


* Creamos un archivo con el nombre de **socrata_mapa.html**.

* Abrimos el archivo socrata_mapa.html con un editor de texto y copiamos el siguiente código.

  
```html

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>
		Basic Leaflet Map sample API Discovery SOCRATA
	</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css" />
	<script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-ajax/2.1.0/leaflet.ajax.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.Spin/1.1.0/leaflet.spin.min.js"></script>
	<style>
		#results {
			width: 100%;
			background-color: #f2f2f2;
			margin: 5px;
		}
	</style>
</head>
<body>

</body>
</html>

```
  


* Añadimos dentro del tag  ```<body>``` la maquetación HTML

  
```html

<div class="container">
<h3>SOCRATA Maps Resources </h3>
<div class="row">
<div class="col-md-6">
<p>Discovery API <br>
<a target="_blank" href="http://docs.socratadiscovery.apiary.io">http://docs.socratadiscovery.apiary.io</a>
</p>
<form>
<div class="form-group">
<div class="radio">
	<label>
<input type="radio" name="optionsRadios" id="optionsRadios1" value="https://api.eu.socrata.com/api/catalog/v1" checked>
EU API Discovery
</label>
</div>
<div class="radio">
	<label>
<input type="radio" name="optionsRadios" id="optionsRadios2" value="https://api.us.socrata.com/api/catalog/v1">
US API Discovery
</label>
	</div>
</div>
<div class="form-group">
	<label for="text_filter_socrata"> Filter <u></u></label>
	<input type="text" class="form-control" id="text_filter_socrata" value="" placeholder="text filter">

	<div class="checkbox">
		<label><input type="checkbox" id="chk_transparencia" value="analisi.transparenciacatalunya.cat" >Only https://analisi.transparenciacatalunya.cat</label>
	</div>
	<div> Filter : only=maps</div>
</div>

	</form>
	<form class="form-inline">
		<div class="form-group">
			<label for="num_results_socrata">Num results</label>
			<input type="number" size="3" class="form-control" id="num_results_socrata" value="25">
		</div>

	</form>
	<form>
		<div class="form-group">
			<button id="bt_send" type="button" class="btn btn-default btn-success">Send</button>
		</div>
	</form>
	<hr>
	<div id="results"></div>
	<div id="mygrid" style="height: 365px;overflow:auto">
	</div>
</div>
<div class="col-md-6">
	<div id="map" style="width:100%;height:700px"></div>
</div>
</div>

```
  

* Abrimos el archivo *socrata_mapa.html* en el navegador.

  

* Añadimos just encima del tag ```</head>``` el siguiente código javascript

  
```javascript

<script>
$.ajaxSetup({
cache: true
});
var map;
var geojsonLayer;
var _LL;
$(document).ready(function() {
map = L.map('map').setView([41.6863, 1.8382], 8);
esri = L.tileLayer(
'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
maxZoom: 17,
minZoom: 1,
attribution: 'Tiles © Esri',
})

osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
minZoom: 1,
attribution: 'OSM'
}).addTo(map);

Stamen_Toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
subdomains: 'abcd',
minZoom: 0,
maxZoom: 20
})

var baseMaps = {
"Orto": esri,
"Mapa": osm,
"Toner": Stamen_Toner
};

L.control.layers(baseMaps, null).addTo(map);
L.control.scale().addTo(map);


$('#bt_send').on('click', function() {
sendRequest();
});

$('#text_filter_socrata').on('keypress', function(event) {
if (event.which == 13) {
sendRequest();
event.preventDefault();
}
});

$(document).on('click', '.btn-xs', function() {

var attr = $(this).attr('data');
if (attr && attr.indexOf('#') != -1) {
var params = attr.split("#");
var _url = 'https://' + params[1] + '/api/views.json?method=getByResourceName&name=' + params[0];
$.ajax({
	url: _url,
	method: 'GET',
	dataType: 'json',
	success: function(data) {

			if (data.childViews) {
					//var _url2 = 'https://' + params[1] + '/resource/' + data.childViews[0] + '.json?$limit=30';
					var _url2 = 'https://' + params[1] + '/api/geospatial/' + data.childViews[0] + '?method=export&format=GeoJSON';
					sendRequestGEOJSON(_url2, true);
			} else {
					var _url2 = 'http://' + params[1] + '/resource/' + params[0] + '.json?$limit=30';
					sendRequestGEOJSON(_url2, false);
			}
	},
	error: function(xhr) {
			$('#results').html("An error occured: " + xhr.status + " " + xhr.statusText);
	}

});

} else {
alert("No resource available");
}
});

function clearLayers() {
if (map.hasLayer(geojsonLayer)) {
map.removeLayer(geojsonLayer);
};
if (map.hasLayer(_LL)) {
map.removeLayer(_LL);
};
}

function sendRequestGEOJSON(_url2, isGeoJson) {
map.spin(true);
var stylePoint = {
radius: 8,
fillColor: "#ff7800",
color: "#000",
weight: 1,
opacity: 1,
fillOpacity: 0.8
};
clearLayers();
$.ajax({
type: "GET",
url: _url2,
// jsonp: "$jsonp",
//  dataType: "jsonp",
success: function(response) {
if (isGeoJson) {

geojsonLayer = L.geoJson(response, {
	style: function(feature) {
		return {
			weight: 2,
			color: "#999",
			opacity: 1,
			fillColor: "#B0DE5C",
			fillOpacity: 0.8
		};
	},

	onEachFeature: popUp
}).addTo(map);
map.fitBounds(geojsonLayer.getBounds());
map.spin(false);
} else {
_LL = L.featureGroup()

for (var i = 0; i < response.length; i++) {
	var marker = response[i];

	if (response[i].location_1) {
		L.circleMarker([response[i].location_1.latitude, response[i].location_1.longitude], stylePoint).addTo(_LL);
	} else if (response[i].location) {
		L.circleMarker([response[i].location.latitude, response[i].location.longitude], stylePoint).addTo(_LL);
	} else {
		$('#results').html("ERROR no locations found");
		map.spin(false);

	}
}

_LL.addTo(map);
map.panTo(_LL.getBounds().getCenter());
map.spin(false);

}
},
error: function(xhr) {
$('#results').html("An error occured: " + xhr.status + " " + xhr.statusText);
map.spin(false);
}
});
}

function popUp(f, l) {
var out = [];
if (f.properties) {
for (key in f.properties) {
	out.push(key + ": " + f.properties[key]);
}
l.bindPopup(out.join("<br />"));
}
}

function sendRequest() {
var _data = {
limit: $('#num_results_socrata').val(),
only: 'maps'
};
console.info($('#chk_transparencia').attr('checked'));
if ($('#chk_transparencia').attr('checked')) {
_data.domains = $('#chk_transparencia').val();
}
if ($('#text_filter_socrata').val() != "") {
_data.q = $('#text_filter_socrata').val();
}

$.ajax({
url: $('input:radio[name=optionsRadios]:checked').val(),
data: _data,
method: 'GET',
dataType: 'json',
success: function(data) {
console.info(data);
if (data) {
$('#results').html('Total results found: ' + data.resultSetSize);
$('#mygrid').html('');

if (data.resultSetSize >= 1) {
	var cList = $('<ul>').appendTo('#mygrid');
	$.each(data.results, function(index, value) {
		$('<li class="li"><b>' + value.resource.name + ': </b>' +
			'<a target="_blank" href="' + value.link + '"> Link </a> ' +
			'<a class="btn btn-success btn-xs"  href="#" data="' + value.resource.id + '#' + value.metadata.domain + '">Map it</a>').appendTo(cList);

	});
}

} else {
console.info(data);
$('#results').html("An error occured:");
}
},
error: function(xhr) {
$('#results').html("An error occured: " + xhr.status + " " + xhr.statusText);
}
});
}
});
</script>


```  

*  Abrimos pàgina socrat_mapa.html y lanzamos búsquedas

  
!!! note
    **Ejercicio 1**: Añadimos **attribution** y **download_count** a los resultados

!!! note
    **Ejercicio 2**: ¿Cambiamos colores y estilos de los puntos del mapa?




Referencias
  
> http://docs.ckan.org/en/latest/api/

> http://ckan.org

> https://www.socrata.com

> http://docs.socratadiscovery.apiary.io
