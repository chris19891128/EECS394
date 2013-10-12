// HTML element global
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var markers = [];
var blueMarker;
var listener;
var info = $('#msg');
var speedBar = $('#speed');

// User inputs
var destination = null;
var targetTime;

// Internal states
var curSpeed; // in m/s
var curLoc;
var accDistance; // in m, accumulated distance traveled
var accTime; // in s, accumulated time spent
var avgSpeed; // in s

// Math constants
var updateInterval = 5; // in s
var notifyInterval = 10; // in s
var timeWindow = 90;
var defSpeed = 1.3; // in m/s

// UI states
var goClicked = false;

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

	// console.log("Your position has changed to " + lat + " " + lng);

	if (curLoc != null) {
		var distance = calDistance(lat, curLoc.lat(), lng, curLoc.lng());
		accDistance = accDistance + distance;
		accTime = accTime + updateInterval;
		curSpeed = distance / updateInterval;
		speedBar.empty().append(
				"You are travelling at speed " + Math.round(curSpeed * 10) / 10
						+ "m/s");
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
		zoom : 17,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		center : nuCampus
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));

	// Get Target Location "destination"
	listener = google.maps.event.addListener(map, 'click', function(event) {
		if (destination == null) {
			destination = event.latLng;
			addMarker(destination);
		} else {
			markers[0].setMap(null);
			markers = [];
			destination = event.latLng;
			addMarker(destination);
		}
	});

	accDistance = 0;
	accTime = 0;
	avgSpeed = defSpeed;
	locatePosition();
}

function locatePosition() {
	var options = {
		enableHighAccuracy : true,
		timeout : 5000,
		maximumAge : 0
	};
	navigator.geolocation.getCurrentPosition(success, fail, options);
}

function addMarker(latlng) {
	markers.push(new google.maps.Marker({
		position : latlng,
		map : map,
	// icon : "http://maps.google.com/mapfiles/marker" +
	// String.fromCharCode(markers.length + 65) + ".png"
	}));
}

function addBlueMarker(latlng) {
	if (blueMarker != null) {
		blueMarker.setMap(null);
	}
	blueMarker = new google.maps.Marker({
		position : latlng,
		map : map,
		icon : "img/dot.png"
	});
}

function calcRoute() {

	goClicked = true;

	if (targetTime == null) {
		var str = document.getElementById("time").value;
		if (str == null) {
			alert("Click on the time setting to add your target time");
			return;
		} else {
			targetTime = new Date();
			targetTime.setHours(str.split(":")[0], str.split(":")[1], 0);
			// TODO check current time is before target time
		}
	}

	if (destination == null) {
		alert("Click on the map to add an end point");
		return;
	}

	google.maps.event.removeListener(listener);

	routeUpdateRoutine();
	trackingRoutine();

	info.parent().toggle().siblings().toggle();
	clearMarkers();
}

function updateRouteOnMap() {
	console.log('updated');
	var mode = google.maps.DirectionsTravelMode.WALKING;

	var request = {
		origin : curLoc,
		destination : destination,
		waypoints : [],
		travelMode : mode,
		optimizeWaypoints : true,
	};

	directionsService.route(request,
			function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
					var adjTime = response.routes[0].legs[0].distance.value
							/ avgSpeed;
					var timeToDest = (targetTime.getTime() - new Date()
							.getTime()) / 1000;
					if (timeToDest - adjTime > timeWindow) {
						tooEarly(timeToDest - adjTime);
					} else if (timeToDest - adjTime < 0 - timeWindow) {
						tooLate(adjTime - timeToDest);
					} else {
						justOk();
					}
				}
			});
}

function tooEarly(sec) {
	clearTimeout(f);
	flash('slow');
	info.parent().parent().removeAttr('class').addClass('relax');
	info.empty().append(
			"Relax! You will arrive at your location " + Math.round(sec / 60)
					+ " mins earlier :)");
}

function tooLate(sec) {
	clearTimeout(f);
	flash('fast');
	info.parent().parent().removeAttr('class').addClass('hurry');
	info.empty().append(
			"Hurry! You will arrive at your destination "
					+ Math.round(sec / 60) + " mins late!");
}

function justOk() {
	clearTimeout(f);
	flash('medium');
	info.parent().parent().removeAttr('class').addClass('ontime');
	info.empty().append("Just keep up, you will be on time :)");
}

function routeUpdateRoutine() {
	updateRouteOnMap();
	setInterval(function() {
		updateRouteOnMap();
	}, notifyInterval * 1000);
}

function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

function clearWaypoints() {
	markers = [];
	destination = null;
}

function resetAll() {
	// stop_flash();
	clearMarkers();
	clearWaypoints();
	directionsDisplay.setMap(null);
	directionsDisplay.setPanel(null);
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));
	document.getElementById("input").reset();
	targetTime = null;
	accDistance = 0;
	accTime = 0;
	avgSpeed = defSpeed;

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var origin = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude);
			map.setCenter(origin);
			map.setZoom(17);
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		handleNoGeolocation(false);
	}
}

function stop() {
	info.parent().parent().removeAttr('class');
	info.parent().toggle().siblings().toggle();
	clearTimeout(f);
	resetAll();
	listener = google.maps.event.addListener(map, 'click', function(event) {
		if (destination == null) {
			destination = event.latLng;
			addMarker(destination);
		} else {
			markers[0].setMap(null);
			markers = [];
			destination = event.latLng;
			addMarker(destination);
		}
	});
	location.reload();
}
