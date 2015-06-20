alert("hello")
function initialize() {
  
  //Styles the googlemaps layout
  var styles = [
    {
      stylers: [
      { invert_lightness: true },
      { weight: 1.0 },
      { hue: "#00ff6f" },
      { saturation: 66 }
    ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "on" }
      ]
    }
  ];

  //Declares map style in variable
  var styledMap = new google.maps.StyledMapType(styles,
      {name: "Styled Map"});

  // //Grabs data from JSON API
  // var url = window.location.origin + window.location.pathname + ".json" + window.location.search

  // $.get(url, function(results){

    //Sets map options
    var mapOptions = {
      zoom: 13,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      }
    };

    //Declares new map and attaches it to googleMap div
    var map = new google.maps.Map(document.getElementById('map'),
      mapOptions);

    //Applies map style to map
    map.setOptions({styles: styles});
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    //Ensures that the map loads where the coordinates are
    var bounds = new google.maps.LatLngBounds();

    // //Iterates through coordinates from JSON data and displays them
    // var coords = [];
    // for(var i = 0; i < results.length; i++){
    //   var coord = new google.maps.LatLng(results[i].lat, results[i].lon)
    //   coords.push({location: coord, weight: results[i].weight})
    //   bounds.extend(coord)
    // }

    // //Sets heatmap settings
    // var heatmap = new google.maps.visualization.HeatmapLayer({
    //   data: coords,
    //   dissipating: false,
    //   radius: 0.007
    // });

    // //Sets map to view heatmap
    // heatmap.setMap(map)

    //Sets bounds as declared on line 55
    // map.fitBounds(bounds)

  })

// The init function needs to run on load
google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'page:load', initialize);
