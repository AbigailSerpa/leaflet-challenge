// Create the map object
var myMap = L.map("map", {
    center: [37.09, -95.71], // Center of the US
    zoom: 5,
  });
  
  // Add a tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(myMap);
  
  // USGS Earthquake GeoJSON URL
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  
  // Fetch earthquake data
  d3.json(queryUrl).then(function (data) {
    // Function to determine marker size based on magnitude
    function markerSize(magnitude) {
      return magnitude * 4; // Scale the size
    }
  
    // Function to determine marker color based on depth
    function markerColor(depth) {
      return depth > 90
        ? "#ea2c2c" // Deep earthquakes - red
        : depth > 70
        ? "#ea822c"
        : depth > 50
        ? "#ee9c00"
        : depth > 30
        ? "#eecc00"
        : depth > 10
        ? "#d4ee00"
        : "#98ee00"; // Shallow earthquakes - green
    }
  
    // Add GeoJSON layer
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag), // Set marker size by magnitude
          fillColor: markerColor(feature.geometry.coordinates[2]), // Set color by depth
          color: "#000", // Black border
          weight: 0.5,
          opacity: 1,
          fillOpacity: 0.8,
        });
      },
      // Add popups
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          `<strong>Location:</strong> ${feature.properties.place}<br>
          <strong>Magnitude:</strong> ${feature.properties.mag}<br>
          <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
        );
      },
    }).addTo(myMap);
  
    // Add legend
    var legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        colors = [
          "#98ee00",
          "#d4ee00",
          "#eecc00",
          "#ee9c00",
          "#ea822c",
          "#ea2c2c",
        ];
  
      // Loop through depth intervals to generate labels
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          colors[i] +
          '"></i> ' +
          depths[i] +
          (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    legend.addTo(myMap);
  });
  
  