// Define letiables for our base layers
let sat = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});

let outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 10,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Create a baseMaps object
let baseMaps = {
  "Satellite Map": sat,
  "Outdoors Map": outdoors,
  "Light Map": lightmap
};


// Link for earthquake data 
let APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

let earth = new L.LayerGroup();
// Grab data with d3
d3.json(APILink, function(data) {

  let quakeInfo = data.features

  for (i = 0; i < quakeInfo.length; i++){

    Lat = quakeInfo[i].geometry.coordinates[1];
    Lon = quakeInfo[i].geometry.coordinates[0];
    Location = [Lat, Lon]
    Mag = quakeInfo[i].properties.mag;
    URL = quakeInfo[i].properties.url;
    Title = quakeInfo[i].properties.title

    // Conditionals for different color of Mag
    let dColor = "";
    if (Mag < 1) {
      dColor = "gray";
    }
    else if (Mag < 2 ) {
      dColor = "cyan";
    }
    else if (Mag < 3 ) {
      dColor = "green";
    }
    else if (Mag < 4 ) {
      dColor = "yellow";
    }
    else if (Mag < 5 ) {
      dColor = "orange";
    }
    else {
      dColor = "red";
    }

    L.circle(Location,{
      fillOpacity: 0.5,
      color: dColor,
      fillColor: dColor,
      weight : 1,
      // Adjust radius
      radius: Mag*30000
    }).bindPopup("<h3>" + Title + "</h3> <hr> <h4>Detail Link: " + URL + "</h4>").addTo(earth)
  }

// Set up the legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = ["0-1","1-2","2-3","3-4","4-5","5+"];
    let colors = ["gray","cyan","green","yellow","orange","red"];
    let labels = [];

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] +"\"> " + limit + "</li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap); 

});

// overlay object
let overlayMap = {
  "Earthquake" : earth
};

// map object
let myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 3,
  layers: [sat,earth]  
});

L.control.layers(baseMaps,overlayMap).addTo(myMap);