// HTML element global
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

var trackingId;
var routingId;

// Math constants
var updateInterval = 5; // in s
var notifyInterval = 10; // in s
var timeWindow = 90;

function startTracking(interval) {
	var options = {
		enableHighAccuracy : true,
		timeout : 5000,
		maximumAge : 0
	};

	if (interval > 0) {
		trackingId = setInterval(function() {
			navigator.geolocation.getCurrentPosition(success, fail, options);
		}, interval * 1000);
	} else {
		navigator.geolocation.getCurrentPosition(success, fail, options);
	}
}

function stopTracking() {
	if (trackingId != null) {
		clearInterval(trackingId);
	} else {
		console.error("You are trying to clear a non-existing tracking thread");
	}
}

function success(position) {
	// Logic part
	updateCurrentPosition(lat, lng);

	// UI part
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	var center = new google.maps.LatLng(lat, lng);
	map.setCenter(center);
	moveBlueMarker(center);
	speedBar.empty().append(
			"You are travelling at speed " + Math.round(curSpeed * 10) / 10
					+ "m/s");
}

function fail(position) {
	console.error("You had an error trying to call the navigator API");
}

function startRecalRoute() {
	var mode = google.maps.DirectionsTravelMode.WALKING;

	var request = {
		origin : curLoc,
		destination : destination,
		waypoints : [],
		travelMode : mode,
		optimizeWaypoints : true,
	};

	routingId = setInterval(function() {
		directionsService.route(request, success);
	}, notifyInterval * 1000);
}

function success(response, status) {
	if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(response);
		var decision = updateSuggestion(response);
		if (decision == "early") {
			tooEarly(timeToDest - adjTime);
		} else if (decision == "late") {
			tooLate(adjTime - timeToDest);
		} else {
			justOk();
		}
	}
}

function stopRecalRoute() {
	if (routingId != null) {
		clearInterval(routingId);
	} else {
		console.error("You are trying to clear a non-existing routing thread");
	}
}

function initialize() {
	if (navigator.userAgent.match(/Android/i)) {
		window.scrollTo(0, 1);
	}
	var myOptions = {
		zoom : 17,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		center : new google.maps.LatLng(42.053483, -87.676631)
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));

	registerMapClickListener();
}

function calcRoute() {

	var str = document.getElementById("time").value;
	if (str == null) {
		alert("Click on the time setting to add your target time");
		return;
	} else {
		targetTime = new Date();
		targetTime.setHours(str.split(":")[0], str.split(":")[1], 0);
		// TODO check current time is before target time
	}

	if (marker == null) {
		alert("Click on the map to add an end point");
		return;
	} else {
		destination = marker.position;
	}

	google.maps.event.removeListener(listener);
	clearMarkers();

	startTracking();
	startRecalRoute();

	info.parent().toggle().siblings().toggle();

}

function resetAll() {
	clearMarkers();
	directionsDisplay.setMap(null);
	directionsDisplay.setPanel(null);
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));
	document.getElementById("input").reset();
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
