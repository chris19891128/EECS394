var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var origin = null;
var destination = null;
var waypoints = [];
var markers = [];
var blueMarker;
var directionsVisible = false;
var cTime = 0;
var gTime = 0;
var tTime = 0;
var updateInterval = 3; // in s
var curSpeed; // in m/s
var curLoc;
var curTimeStamp;
var info = $('#info span');
var gSpeed = 1.34112;

function trackingRoutine() {
	var options = {
		enableHighAccuracy : true,
		timeout : 5000,
		maximumAge : 0
	};

	setInterval(function() {
		navigator.geolocation.getCurrentPosition(success, fail, options);
	}, updateInterval * 1000);
}

function success(position) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;

	console.log("Your position has changed to " + lat + " " + lng);
	document.getElementById("info").innerHTML = "Your position has changed to"
			+ lat + " " + lng;

	if (curLoc != null) {
		var distance = calDistance(lat, curLoc.lat(), lng, curLoc.lng())
		curSpeed = distance / updateInterval;
		console.log("You are now walking at speed " + curSpeed + "m/s");
		document.getElementById("info").innerHTML = "You are now walking at speed "
				+ curSpeed + "m/s";
	}
	curLoc = new google.maps.LatLng(lat, lng);

	map.setCenter(curLoc);
	addBlueMarker(curLoc);
}

function fail(position) {

}

function initialize() {
	if (navigator.userAgent.match(/Android/i)) {
		window.scrollTo(0, 1);
	}
	directionsDisplay = new google.maps.DirectionsRenderer();

	var nuCampus = new google.maps.LatLng(42.053483, -87.676631);
	var myOptions = {
		zoom : 18,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		center : nuCampus
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));

	// Get Target Location "destination"
	google.maps.event.addListener(map, 'click', function(event) {
		destination = event.latLng;
		addMarker(destination);
	});

	trackingRoutine();
}

function addMarker(latlng) {
	markers.push(new google.maps.Marker({
		position : latlng,
		map : map,
		icon : "http://maps.google.com/mapfiles/marker"
				+ String.fromCharCode(markers.length + 65) + ".png"
	}));
}

function addBlueMarker(latlng) {
	if (blueMarker != null) {
		blueMarker.setMap(null);
	}
	blueMarker = new google.maps.Circle({
		center : latlng,
		map : map,
		clickable : false,
		fillColor : '#808080',
		radius : 1,
	})
}

function calcRoute() {

	if (origin == null) {
		origin = curLoc;
	}

	if (destination == null) {
		alert("Click on the map to add an end point");
		return;
	}

	var mode = google.maps.DirectionsTravelMode.WALKING;

	var tTime = document.getElementById("time").value;
	console.log(tTime);
	var cTime = getCurrentTime();
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
			info.empty().append(
					"Google Time: " + response.routes[0].legs[0].duration.value
							+ " secs");
		}
	});

	clearMarkers();
	directionsVisible = true;
	info.parent().toggle().siblings().toggle();
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

function stop() {
	reset();
	info.parent().toggle().siblings().toggle();
}

function getCurrentTime() {
	var date = new Date();
	var time = date.toLocaleTimeString();
	return time;
}

function vibration_slow() {
	// var supportsVibrate = "vibrate" in navigator;
	// alert("supportsVibrate: " + supportsVibrate);
	navigator.vibrate(1000);
}

function vibration_fast() {
	navigator.vibrate(2000);
}
