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
                    // lotInfoWindow.open(map, lM);
                    lotmsg = ("<p>" + "<b>" + lD.name + "</b>" + "<br />"
                        + "Spaces: " + String(lD.available_spaces) + "</p>")
                    // lotInfoWindow.setContent(lotmsg);
                    $('#textbox').html(lotmsg);
                })
            }
        }
    });

    //API call for parking meters
    var meters = [];
    $.ajax("https://parking.api.smgov.net/meters/", {
        success: function(data) {
            meters = data;
            // console.log(meters.length); <== CHECKPOINT

            //collects and plots parking meters on the map in clusters
            var meterMarkers = [];
            for (var i = 0; i < meters.length; i++) {

                //gets icon for meter status
                var getIcon = function() {
                    if (meterData.active == true) {
                        return "assets/meter-icon.png";
                    } else {
                        return "assets/broken-meter-icon.png"
                    };
                };
                
                var meterData = meters[i];
                var meterPosition = new google.maps.LatLng(meterData.latitude, meterData.longitude)
                var meterMarker = new google.maps.Marker({
                    position: meterPosition,
                    map: map
                });
                meterMarker.setIcon(getIcon());
                meterMarkers.push(meterMarker);
                getMeterData(meterData, meterMarker);
            }
            var meterClusterOptions = {
                maxZoom: 19
            }
            var meterMarkerCluster = new MarkerClusterer(map, meterMarkers, meterClusterOptions);


            //captures meter data for infowindow when meter marker is clicked
            var meterInfoWindow = new google.maps.InfoWindow();
            function getMeterData(mD, mM) {

                //function that returns meter status
                var getMeterStatus = function() {
                    if (mD.active == true) {
                        return "Status: Working";
                    } else {
                        return "Status: Not available or out of service";
                    }
                }

                //adds listener to each marker to display infowindow when clicked
                google.maps.event.addListener(mM, "click", function() {

                    //checks current meter availability
                    var meterSession = [];
                    $.ajax("https://parking.api.smgov.net/meters/" + mD.meter_id + "/events/since/0", {
                        success: function(data) {
                            meterSession = data;

                            //gets meter session detail
                            var getSessionDetail = function() {
                                var sessionDetail = meterSession;

                                if ((sessionDetail.length > 0) && (sessionDetail[0].event_type == "SS")) {
                                    return "Availability: Occupied";
                                } else if ((sessionDetail.length > 0) && (sessionDetail[0].event_type == "SE")) {
                                    return "Availability: Vacant, but not for long!";
                                } else {
                                    return "Availability: Sorry, no details available.";
                                };
                            };

                            //info window that pops up on click
                            // meterInfoWindow.open(map, mM);
                            metermsg = (
                                "<p>" + "ID: " + "<b>" + String(mD.meter_id) + "</b>" + "</p>"
                                + "Street: " + "<b>" + mD.street_address + "</b>" + "<br />"
                                + getMeterStatus() + "<br />"
                                + getSessionDetail()
                            )
                            // meterInfoWindow.setContent(metermsg)
                           $('#textbox').html(metermsg);
                        }
                    })
                })
            }
        }
    }) 
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

