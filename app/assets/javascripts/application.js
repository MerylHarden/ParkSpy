// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require bootstrap-sprockets

//start google maps


function initialize() {
  	// console.log("initializing") <== CHECKPOINT

    //sets center to city of santa monica
    var center = new google.maps.LatLng(34.0218628, -118.4804206)

    // sets map style
    var mapStyle = [
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
            { "visibility": "on" },
            { "color": "#f1f1f1" }
          ]
        },{
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            { "visibility": "on" },
            { "color": "#808080" },
            { "weight": 0.1 }
          ]
        },{
          "featureType": "poi",
          "elementType": "geometry.fill",
          "stylers": [
            { "visibility": "on" },
            { "color": "#f8f8f8" }
          ]
        },{
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [
            { "visibility": "on" },
            { "color": "#cc3333" }
          ]
        }
      ]  

    //sets map options
        var mapOptions = {
          center: center,
          zoom: 14,
          mapTypeControlOptions: {
              mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'santamonicamap']
          }
        };

    //html element place holder for google map
    var map = new google.maps.Map(document.getElementById('map'),
          mapOptions);

    //aplies style to map
    var styledMapOptions = {
      name: "Santa Monica Map"
    };
    var SantaMonicaRoadMapType = new google.maps.StyledMapType(
        mapStyle, styledMapOptions);
    map.mapTypes.set('santamonicamap', SantaMonicaRoadMapType);
    map.setMapTypeId('santamonicamap');

    // console.log("initialized") <== CHECKPOINT

    //adds traffic layer to map
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    //API call for parking lots/structures
    var lots = [];
    $.ajax("https://parking.api.smgov.net/lots/", {
        success: function(data) {
            lots = data;
            // console.log(lots.length); <== CHECKPOINT

            //collects and plots parking lots/structures on the map in clusters
            var lotMarkers = [];
            for (var i = 0; i < lots.length; i++) {
                var lotData = lots[i];
                var lotImage = '/assets/lot-icon.png';
                var lotPosition = new google.maps.LatLng(lotData.latitude, lotData.longitude);
                var lotMarker = new google.maps.Marker({
                    position: lotPosition,
                    map: map,
                    icon: lotImage
                });
                lotMarkers.push(lotMarker);
                getLotData(lotData, lotMarker);
            }
            var lotMarkerCluster = new MarkerClusterer(map, lotMarkers);

            //captures lot data for infowindow when lot marker is clicked
            var lotInfoWindow = new google.maps.InfoWindow();
            function getLotData(lD, lM) {
                google.maps.event.addListener(lM, 'click', function() {
                    lotInfoWindow.open(map, lM);
                    lotInfoWindow.setContent(
                        "<p>" + "<b>" + lD.name + "</b>" + "<br />"
                        + "Spaces: " + String(lD.available_spaces) + "</p>"
                    );
                })
            }
        }
    });





}









//initializer
function loadScript() {
	// console.log("loading script") <== CHECKPOINT
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true&callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;