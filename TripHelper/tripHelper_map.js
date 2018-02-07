//---------------------------params-------------------------
//collect directionService in transit travel mode(to control its display).
var transitDirectionServiceArray = [];

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
      //Taipei,Taiwan
      center: {lat: 25.0318908, lng: 121.529877},
      zoom: 12
    });
    var infoWindow = new google.maps.InfoWindow();
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
        map.setZoom(17);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
    //1st panel
    initPlace(1);
  }

  //set user position as map center
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

  function initPlace(seq) {
    var infoWindow = new google.maps.InfoWindow();
    var input = (document.getElementById(`loc${seq}`));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    //change place.
    autocomplete.addListener('place_changed', function() {
      infoWindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        $(document).keypress(function (e) {
            if (!e.which == 13) {
              // User entered the name of a Place that was not suggested and
              // pressed the Enter key, or the Place Details request failed.
              window.alert("No details available for input: '" + place.name + "'");
              return;
            }
        });
      }
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      //setPanelMarker to markerMap, "marker" + seq as key, marker as value.
      markerMap.set(`marker${seq}`, marker);
      //set location
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infoWindow.open(map, marker);
      //set location data to panel.
      var location = $(`#loc${seq}`).val();
      //--panel title---
      $(`#a${seq}`).text(location);
      //--coordinate---
      $(`#lat${seq}`).val(marker.position.lat);
      $(`#lng${seq}`).val(marker.position.lng);
      //draw polyline.
      drawPolyline();
    });

    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });
  }

  //change location but not throw autocomplete.
  function changeLocation(seq) {
    var location = $(`#loc${seq}`).val();
    //--panel title---
    $(`#a${seq}`).text(location);
  } 
  // change coordinate and update on the map not throw autocomplete.
  function changeCoordinate(seq) {
    var marker = markerMap.get(`marker${seq}`);
    var lat = Number($(`#lat${seq}`).val());
    var lng = Number($(`#lng${seq}`).val());
    marker.setPosition({lat: lat, lng: lng});
    map.setCenter({lat: lat, lng: lng});
  }
  //if the clicked panel is open, pan to the according marker position.
  function clickPanel(seq) {
    var collapseId = `#collapse${seq}`;
    var active = !$(collapseId).hasClass("in");
    if(active) {
      var latlng = markerMap.get(`marker${seq}`).getPosition();
      map.panTo(latlng);
    }
  }
  //get order of locations.
  function getOrder() {
    var array = Array.from($("[data-seq]"), x => $(x).attr("data-seq"));
    return array;
  }

  //draw polyline on the map.
  function drawPolyline() {
    if(polyline) {
      polyline.setMap(null);
    }
    var array = getOrder();
    var markers = [];
    $.each(array, function(index, value) {
      var marker = markerMap.get(`marker${value}`).getPosition();
      markers.push({lat: marker.lat(), lng: marker.lng()});
    });
    polyline = new google.maps.Polyline({
          path: markers,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
    polyline.setMap(map);
  }

  //travel Arrangements tab
  function travelArrangements() {
    transitDirectionServiceArray.forEach(function(service,index) {
      service.setMap(null);
    });
    transitDirectionServiceArray = [];
    //clear last direction service.
    if(directionsService && directionsDisplay) {
      $('#dsPanelBody').html("");
      directionsDisplay.setMap(null);
    }

    if(markerMap.size > 0) {
      for (var value of markerMap) {
        var marker = value[1];
        marker.setMap(map);
      }
    }

    if(polyline) {
      polyline.setMap(map);
    }
  }

  //click Direction Service tab to start direction service, default travel mode: driving.
  function directionService(travelMode) {
    transitDirectionServiceArray.forEach(function(service,index) {
      service.setMap(null);
    });
    transitDirectionServiceArray = [];
    //clear last direction service and remove all markers and polyline.
    if(directionsService && directionsDisplay) {
      $('#dsPanelBody').html("");
      directionsDisplay.setMap(null);
    }
    
    if(markerMap.size > 0) {
      for (var value of markerMap) {
        var marker = value[1];
        marker.setMap(null);
      }
    }

    if(polyline) {
      polyline.setMap(null);
    }
    //panel title
    $("#dsA").text(travelMode);
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map,
      panel: document.getElementById('dsPanelBody')
    });

    //get locations order in travel arrangement.
    var array = getOrder();
    
    if(array.length != 1) {
      if(travelMode == "transit" && array.length>2) {
          //split into route without waypoints.(for travel mode : Transit)
          var transitRoute = [];
          for(var i=0; i<array.length-1; i++) {
            var seq = i;
            var route = [];
            route.push(array[seq]);
            route.push(array[seq+1]);
            transitRoute.push(route);
          }
          for(var i=0; i<transitRoute.length; i++) {
            var route = transitRoute[i];
            //origin
            var oriSeq = route[0];
            var origin = markerMap.get(`marker${oriSeq}`).getPosition();
            //destination seq
            var desSeq = route[1];
            var destination = markerMap.get(`marker${desSeq}`).getPosition();

            travelMode = travelMode.toUpperCase();
            directionsService = new google.maps.DirectionsService;
            directionsDisplay = new google.maps.DirectionsRenderer({
              map: map,
              panel: document.getElementById('dsPanelBody')
            });
            displayRoute(origin, null, destination, travelMode, directionsService, directionsDisplay);
            transitDirectionServiceArray.push(directionsDisplay);
          }
        } else {
          //origin
          var oriSeq = array[0];
          var origin = markerMap.get(`marker${oriSeq}`).getPosition();

          //waypoints
          var waypoints = [];
          for(var i=1; i<array.length-1; i++) {
            var seq = array[i];
            var point = markerMap.get(`marker${seq}`).getPosition();
            waypoints.push({location: point});
          }

          //destination
          var desSeq = array[array.length-1];
          var destination = markerMap.get(`marker${desSeq}`).getPosition();

          //default travel mode: driving.
          travelMode = travelMode.toUpperCase();
          displayRoute(origin, waypoints, destination, travelMode, directionsService, directionsDisplay);
        }
        
        //resize direction service panel.
        resizeDsPanel();
        //force to show direction service panel.
        $("#dsCollapse").collapse('show');
      }
    }
    

  function displayRoute(origin, waypoints, destination, travelMode, service, display) {
    service.route({
      origin: origin,
      waypoints: waypoints,
      destination: destination,
      travelMode: travelMode,
      avoidTolls: true
    }, function(response, status) {
      if (status === 'OK') {
        display.setDirections(response);
      } else {
        $('#dsPanelBody').html("Sorry, there is no route provided.");
      }
    });
  }