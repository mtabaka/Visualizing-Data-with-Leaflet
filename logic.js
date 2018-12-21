// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
var TectonicPlatesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

function markerSize(magnitude) {
    return magnitude * 3;
};
  


d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

    

    function styleInformation(feature) {
    return {
      radius: markerSize(feature.properties.mag),
      opacity: 1,
      fillOpacity: .75,
      fillColor: Color(feature.properties.mag),
      color: "black",
      weight: 1.5
    };
    
  }
  function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.title +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        }

        

        // Converts the earthquake data array to geoJSON
        var earthquakes = L.geoJSON(earthquakeData, {
            pointToLayer: function(feature, place) {
              return L.circleMarker(place, {radius: markerSize(feature.properties.mag)});
            },
            style: styleInformation,
            onEachFeature: onEachFeature
        });
        createMap(earthquakes);
      }
      function Color(magnitude) {
    if (magnitude > 6) {
        return 'darkred'
    } else if (magnitude > 5.5) {
        return 'darkorange'
    } else if (magnitude > 5) {
        return 'orange'
    } else if (magnitude > 4.5) {
        return 'yellow'
    } else if (magnitude > 4) {
        return 'darkblue'
    } else {
        return 'lightgreen'
    }
};
        

        function createMap(earthquakes) {


    var streetmap =
     L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });

    var satellite =
     L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });
   
var tectonicPlates = new L.LayerGroup();

d3.json(TectonicPlatesLink, function(plateData) {
    L.geoJson(plateData, {
      color: "orange",
      weight: 3
    }).addTo(tectonicPlates);
  });

var baseMaps = {
    "Street Map": streetmap,
    "Satellite": satellite
  };

// Create an overlay object to hold our layer
var overlayMaps = {
  "Tectonic Plates": tectonicPlates,
  "Earthquakes": earthquakes
};

// Create a new map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    0.00, -0.00
  ],
  zoom: 2,
  layers: [streetmap, tectonicPlates, earthquakes ]});




// Create a layer control containing our baseMaps
// Be sure to add an overlay Layer containing the earthquake GeoJSON
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function() {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [3, 4, 4.5, 5, 5.5, 6],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);
  }


