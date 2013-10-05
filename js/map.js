var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var origin = null;
var destination = null;
var waypoints = [];
var markers = [];
var directionsVisible = false;
var date = new Date();
var cur_hour = 0;
var cur_min = 0;
var cTime = new Date();
var gTime = new Date();
var tTime = new Date();
var rTime = new Date();
var get_t_Time = new Date();
var get_c_Time = new Date();
var updateInterval = 3; // in s
var curSpeed; // in m/s
var curLoc;

/*
 * function getCurrentLocation(){ // if(navigator.geolocation) { return
 * navigator.geolocation.getCurrentPosition(function(position) { var loc = new
 * google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 * alert("current location " + loc.lat() + " " + loc.lng()); return loc; },
 * function() { alert("you don't have permission set"); return null; }); // } }
 */

function addBlueMarker(loc) {
	markers.push(new google.maps.Marker({
		position : loc,
		map : map,
		// K-marker
		icon : "http://maps.google.com/mapfiles/marker"
				+ String.fromCharCode(10 + 65) + ".png"
	}));
}

function trackRoutine() {
	setInterval(function() {
		navigator.geolocation.getCurrentPosition(function(position) {
			var nextLoc = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude);
			// alert("Now you are at " + nextLoc.lat() + " " + nextLoc.lng());
			addBlueMarker(nextLoc);
			curSpeed = calDistance(curLoc.lat(), nextLoc.lat(), curLoc.lng(),
					nextLoc.lng())
					/ updateInterval;
			// alert("Now you are travelling in speed of " + curSpeed + "m/s");
			curLoc = nextLoc;
		}, function() {
			alert("you don't have permission set");
		})
	}, updateInterval * 1000);
}

function initialize() {
	if (navigator.userAgent.match(/Android/i)) {
		window.scrollTo(0, 1);
	}
	directionsDisplay = new google.maps.DirectionsRenderer();
	var nuCampus = new google.maps.LatLng(42.053483, -87.676631);
	var myOptions = {
		zoom : 15,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		center : nuCampus
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));

	// Get Current Location "origin"
	// if(navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
		origin = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude);
		map.setCenter(origin);
		addMarker(origin);
		curLoc = origin;
	}, function() {
		handleNoGeolocation(true);
	});
	// } else {
	// Browser doesn't support Geolocation
	// handleNoGeolocation(false);
	// }

	// Get Target Location "destination"
	google.maps.event.addListener(map, 'click', function(event) {
		destination = event.latLng;
		addMarker(destination);
	});

	// Run the routine of position update in separate thread
	setTimeout(trackRoutine, 0);
}

function addMarker(latlng) {
	markers.push(new google.maps.Marker({
		position : latlng,
		map : map,
		icon : "http://maps.google.com/mapfiles/marker"
				+ String.fromCharCode(markers.length + 65) + ".png"
	}));
}

function calcRoute() {
	alert("you click the go!");
	tTime = document.getElementById("time").value;
	cTime = getCurrentTime();
	get_t_Time = setTime(tTime);
	get_c_Time = setTime(cTime);
	
	if (get_t_Time<=get_c_Time)
	{
		alert("target time is less than current time!");
	}
	if (origin == null) {
		alert("Click on the map to add a start point");
		return;
	}

	if (destination == null) {
		alert("Click on the map to add an end point");
		return;
	}

	var mode = google.maps.DirectionsTravelMode.WALKING;

	
	console.log(tTime);
	//alert("target time: " + tTime);
	//alert("current time: " + cTime);
	//alert(typeof tTime);
	//alert(typeof cTime);
	//alert("target time: " + tTime);
	//alert("current time: " + cTime);
	var gap = get_t_Time.getTime() - get_c_Time.getTime();
	alert("time gap: " + (gap/1000));
	//rTime = getrestTime(tTime, cTime);
	//getrestTime(tTime, cTime);
	//alert("rest Time: " + rTime);
	console.log(cTime);

	var request = {
		origin : origin,
		destination : destination,
		waypoints : waypoints,
		travelMode : mode,
		optimizeWaypoints : true,
	};

	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			document.getElementById("info").innerHTML = "Google Time: "
					+ response.routes[0].legs[0].duration.value + " secs";
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

function reset_all() {
	alert("you click the reset");
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

function getCurrentTime() {
	cur_hour = date.getHours();
	cur_min = date.getMinutes();
	var time = cur_hour+":"+cur_min;
	return time;
}

function setTime(time)
{
	var time_array = new Array();
	time_array = time.split(":");
	var tar_hour = time_array[0];
	var tar_min = time_array[1];
	alert("tar hour: " + tar_hour);
	alert("tar min: " + tar_min);
	var TTime = new Date();
	TTime.setHours(time_array[0],time_array[1]);
	alert(TTime);
	alert(typeof TTime);
	return TTime;
}
	

function vibration_slow() {
	// var supportsVibrate = "vibrate" in navigator;
	// alert("supportsVibrate: " + supportsVibrate);
	navigator.vibrate(1000);
}

function vibration_fast() {
	navigator.vibrate(2000);
}
