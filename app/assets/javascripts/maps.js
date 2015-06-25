// runs the following on load
google.maps.event.addDomListener(window, 'load', function() {

    // variable center set to santa monica city hall
    var center = new google.maps.LatLng(34.011769, -118.49162);

    // defines map style
    var mapStyle = [
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              { "visibility": "on" },
              { "color": "#808080" },
              { "weight": 0.1 }
            ]
          }
        ]

    // default map options
    var mapOptions = {
      center: center,
      zoom: 18,
      mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'santamonicamap']
      }
    };

    // targets html element where map will be placed
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    //applies map style
    var styledMapOptions = {
        name: "Santa Monica Map"
    };
    var SantaMonicaRoadMapType = new google.maps.StyledMapType(mapStyle, styledMapOptions);
    map.mapTypes.set('santamonicamap', SantaMonicaRoadMapType);
    map.setMapTypeId('santamonicamap');

    // adds traffic layer to map
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);


    // gets current position
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // map.setCenter(pos);
    });

    // adds test marker to map center => Santa Monica city hall
    var marker = new google.maps.Marker({
        position: center,
        map: map
    });


    // collects and plots parking lots/structures on map
    var lots = [];
    $http.get("https://parking.api.smgov.net/lots/")
        .success(function(data, status, headers, config){
            $scope.lots = data;
            // counts number of lots
            // console.log($scope.lots.length);


            // collects and plots parking lots/structures on map in clusters
            var lotMarkers = [];
            for (var i = 0; i < ($scope.lots.length); i++) {
                var lotData = $scope.lots[i];
                var lotImage = 'img/lot-icon.png';
                var lotPosition = new google.maps.LatLng(lotData.latitude, lotData.longitude);
                var lotMarker = new google.maps.Marker({
                    position: lotPosition,
                    map: map,
                    icon: lotImage
                });
                lotMarkers.push(lotMarker);
                getLotData(lotData, lotMarker);
            };
            var lotMarkerCluster = new MarkerClusterer(map, lotMarkers);

            //captures lot data and makes them available for display in infowindow when lot marker is clicked
            var lotInfoWindow = new google.maps.InfoWindow();
            function getLotData(lD, lM) {
                google.maps.event.addListener(lM, 'click', function() {
                    lotInfoWindow.open(map, lM);
                    lotInfoWindow.setContent(
                        "<p>" + "<b>" + lD.name + "</b>" + "<br />" 
                        + "Spaces: " + lD.available_spaces + "</p>"
                    );
                });
            };
        });
   // collects and plots parking meters on map
    $scope.meters = [];
    $http.get("https://parking.api.smgov.net/meters/")
        .success(function(data, status, headers, config){
            $scope.meters = data;                
            // counts number of meters
            // console.log($scope.meters.length);


            // collects and plots parking meters on map
            var meterMarkers = [];
            for (var i = 0; i < ($scope.meters.length); i++) {
                var meterData = $scope.meters[i];

                //checks meter status for correct icon
                var getIcon = function() {
                    if (meterData.active == true) {
                        return "img/meter-icon.png";
                    } else {
                        return "img/broken-meter-icon.png";
                    };
                };

                var meterData = $scope.meters[i];
                var meterPosition = new google.maps.LatLng(meterData.latitude, meterData.longitude)
                var meterMarker = new google.maps.Marker({
                    position: meterPosition,
                    map: map,
                });
                meterMarker.setIcon(getIcon());
                meterMarkers.push(meterMarker);
                getMeterData(meterData, meterMarker);
                // getMeterSession(meterData);
            };
            var meterClusterOptions = {maxZoom: 19};
            var meterMarkerCluster = new MarkerClusterer(map, meterMarkers, meterClusterOptions);

            //captures meter data and makes them available for display in infowindow when meter marker is clicked
            var meterInfoWindow = new google.maps.InfoWindow();
            function getMeterData(mD, mM) {

                //captures meter status
                var getMeterStatus = function() {
                    if (mD.active == true ) {
                        return "Status: Working";
                    } else {
                        return "Status: Not available or out of service";
                    };

                };
                                    google.maps.event.addListener(mM, 'click', function() {

                    //captures meter session
                    $scope.meterSession = [];
                    $http.get("https://parking.api.smgov.net/meters/" + mD.meter_id + "/events/since/0")
                        .success(function(data, status, headers, config) {
                            $scope.meterSession = data;
                            // console.log($scope.meterSession)

                            //gets meter session detail
                            var getSessionDetail = function() {
                                var sessionDetail = $scope.meterSession;
                                // console.log(sessionDetail);

                                if ((sessionDetail.length > 0) && (sessionDetail[0].event_type == "SS")) {
                                    return "Availability: Occupied";
                                } else if ((sessionDetail.length > 0) && (sessionDetail[0].event_type == "SE")) {
                                    return "Availability: Vacant, but not for long!";
                                } else {
                                    return "Availability: Sorry, no details available."
                                };
                            };                         

                            //info window pops up on click
                            meterInfoWindow.open(map, mM);
                            meterInfoWindow.setContent(
                                "<p>" + "ID: " + "<b>" + mD.meter_id + "</b>" + "<br />"
                                + "<p>" + "Street: " + "<b>" + mD.street_address + "</b>" + "<br />"
                                + getMeterStatus() + "<br />"
                                + getSessionDetail()
                            );
                        });
                });
            };
        }); 



});

// alert("hello")
// function initialize() {
  
//   //Styles the googlemaps layout
//   var styles = [
//     {
//       stylers: [
//       { invert_lightness: true },
//       { weight: 1.0 },
//       { hue: "#00ff6f" },
//       { saturation: 66 }
//     ]
//     },{
//       featureType: "road",
//       elementType: "geometry",
//       stylers: [
//         { lightness: 100 },
//         { visibility: "simplified" }
//       ]
//     },{
//       featureType: "road",
//       elementType: "labels",
//       stylers: [
//         { visibility: "on" }
//       ]
//     }
//   ];

//   //Declares map style in variable
//   var styledMap = new google.maps.StyledMapType(styles,
//       {name: "Styled Map"});

//   // //Grabs data from JSON API
//   // var url = window.location.origin + window.location.pathname + ".json" + window.location.search

//   // $.get(url, function(results){

//     //Sets map options
//     var mapOptions = {
//       zoom: 13,
//       mapTypeControlOptions: {
//         mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
//       }
//     };

//     //Declares new map and attaches it to googleMap div
//     var map = new google.maps.Map(document.getElementById('map'),
//       mapOptions);

//     //Applies map style to map
//     map.setOptions({styles: styles});
//     map.mapTypes.set('map_style', styledMap);
//     map.setMapTypeId('map_style');

//     //Ensures that the map loads where the coordinates are
//     var bounds = new google.maps.LatLngBounds();

//     // //Iterates through coordinates from JSON data and displays them
//     // var coords = [];
//     // for(var i = 0; i < results.length; i++){
//     //   var coord = new google.maps.LatLng(results[i].lat, results[i].lon)
//     //   coords.push({location: coord, weight: results[i].weight})
//     //   bounds.extend(coord)
//     // }

//     // //Sets heatmap settings
//     // var heatmap = new google.maps.visualization.HeatmapLayer({
//     //   data: coords,
//     //   dissipating: false,
//     //   radius: 0.007
//     // });

//     // //Sets map to view heatmap
//     // heatmap.setMap(map)

//     //Sets bounds as declared on line 55
//     // map.fitBounds(bounds)

//   })

// // The init function needs to run on load
// google.maps.event.addDomListener(window, 'load', initialize);
// google.maps.event.addDomListener(window, 'page:load', initialize);

