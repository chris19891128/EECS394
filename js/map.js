  var directionDisplay;
  var directionsService = new google.maps.DirectionsService();
  var map;
  var origin = null;
  var destination = null;
  var waypoints = [];
  var markers = [];
  var directionsVisible = false;
<<<<<<< HEAD
  var gTime = 0;
  var tTime = 0;
=======
  var gTime;
  var updateInterval = 3;	// in s
  var curSpeed;			// in m/s
  var curLoc;
>>>>>>> 4f32f2634712a293bbe7da3f3e8522b6a792e242

  function getCurrentLocation(){
   // if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var loc = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
        alert("current location " + loc.lat() + " " + loc.lng());
	return loc;
      }, function() {
	alert("you don't have permission set");	
      });
 //   }
  }

  function getCurrentLocationFake(){

  }


  function trackRoutine(){
    setInterval(function(){
      var nextLoc = getCurrentLocation();
      alert("Now you are at " + nextLoc.lat() + " " + nextLoc.lng());		
      curSpeed = calDistance(curLoc.lat(), nextLoc.lat(), curLoc.lng(), nextLoc.lng()) / updateInterval;
      alert("Now you are travelling in speed of " + curSpeed + "m/s");
      curLoc = nextLoc;
    }, updateInterval * 1000);
     
  }  

  
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
//    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        origin = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
        map.setCenter(origin);
        addMarker(origin);
      }, function() {
        handleNoGeolocation(true);
      });
//    } else {
      // Browser doesn't support Geolocation
//      handleNoGeolocation(false);
//    }

    //Get Target Location "destination"
    google.maps.event.addListener(map, 'click', function(event) {
      destination = event.latLng;
      addMarker(destination);
    });

    //Run the routine of position update in separate thread
    setTimeout(trackRoutine, 0);
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
