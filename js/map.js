var directionDisplay;
  var directionsService = new google.maps.DirectionsService();
  var map;
  var origin = null;
  var destination = null;
  var waypoints = [];
  var markers = [];
  var directionsVisible = false;
  var gTime = 0;
  var tTime = 0;

  function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var nuCampus = new google.maps.LatLng(42.053483, -87.676631);
    var myOptions = {
      zoom:15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: nuCampus
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
    

    //Get Current Location "origin"
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        origin = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
        map.setCenter(origin);
        addMarker(origin);
      }, function() {
        handleNoGeolocation(true);
      });
    } else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }

    //Get Target Location "destination"
    google.maps.event.addListener(map, 'click', function(event) {
      destination = event.latLng;
      addMarker(destination);
    });
  }

  function addMarker(latlng) {
    markers.push(new google.maps.Marker({
      position: latlng, 
      map: map,
      icon: "http://maps.google.com/mapfiles/marker" + String.fromCharCode(markers.length + 65) + ".png"
    }));    
  }

  function calcRoute() {
    if (origin == null) {
      alert("Click on the map to add a start point");
      return;
    }
    
    if (destination == null) {
      alert("Click on the map to add an end point");
      return;
    }
    
    var mode = google.maps.DirectionsTravelMode.WALKING;
    
    var tTime = document.getElementById("time").value;
    console.log(tTime);

    var request = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: mode,
        optimizeWaypoints: true,
    };
    
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        document.getElementById("info").innerHTML="Google Time: " + response.routes[0].legs[0].duration.value + " secs";
      }
    });
    
    clearMarkers();
    directionsVisible = true;
  }
  
  function updateMode() {
    if (directionsVisible) {
      calcRoute();
    }
  }
  
  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
  
  function clearWaypoints() {
    markers = [];
    origin = null;
    destination = null;
    waypoints = [];
    directionsVisible = false;
  }
  
  function reset() {
    clearMarkers();
    clearWaypoints();
    directionsDisplay.setMap(null);
    directionsDisplay.setPanel(null);
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));    
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          origin = new google.maps.LatLng(position.coords.latitude,
                                          position.coords.longitude);
          map.setCenter(origin);
          addMarker(origin);
      }, function() {
          handleNoGeolocation(true);
      });
    } else {
      handleNoGeolocation(false);
    }
    map.setZoom(15);
  }
