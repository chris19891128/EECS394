var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var marker;
var blueMarker;
var listener;

// Routing constants
var routingId;

// Tracking constants
var trackingId;

function initialize() {
	if (navigator.userAgent.match(/Android/i)) {
		window.scrollTo(0, 1);
	}
	var myOptions = {
		zoom : 17,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	startTracking(0);

	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));

	listener = google.maps.event.addListener(map, 'click', function(event) {
		clearMarkers();
		addMarker(event.latLng);
	});
}

function resetAll() {
	clearMarkers();
	directionsDisplay.setMap(null);
	directionsDisplay.setPanel(null);
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));
}

function addMarker(latlng) {
	marker = new google.maps.Marker({
		position : latlng,
		map : map,
	});
}

function clearMarkers() {
	if (marker != null) {
		marker.setMap(null);
	}
}

function moveBlueMarker(latlng) {
	if (blueMarker != null) {
		blueMarker.setMap(null);
	}
	blueMarker = new google.maps.Marker({
		position : latlng,
		map : map,
		icon : "img/dot.png"
	});
}

function removeBlueMarker() {
	if (blueMarker != null) {
		blueMarker.setMap(null);
	}
}

function startRecalRoute(interval) {
	recalRoute();
	if (interval > 0) {
		routingId = setInterval(function() {
			recalRoute();
		}, interval * 1000);
	}
}

function recalRoute() {
	var request = {
		origin : curLoc,
		destination : destination,
		travelMode : google.maps.DirectionsTravelMode.WALKING,
		optimizeWaypoints : true,
	};
	directionsService.route(request, routingSuccess);
}

function routingSuccess(response, status) {
	console.log("routing success");
	if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(response);
		updateSuggestion(response); // banner do stuff
	}
}

function stopRecalRoute() {
	if (routingId != null) {
		clearInterval(routingId);
	} else {
		console.error("You are trying to clear a non-existing routing thread");
	}
}

function startTracking(interval) {
	var options = {
		enableHighAccuracy : true,
		timeout : 5000,
		maximumAge : 0
	};

	navigator.geolocation.getCurrentPosition(trackingSuccess, trackingFailure,
			options);
	if (interval > 0) {
		trackingId = setInterval(function() {
			navigator.geolocation.getCurrentPosition(trackingSuccess,
					trackingFailure, options);
		}, interval * 1000);
	}
}

function stopTracking() {
	if (trackingId != null) {
		clearInterval(trackingId);
	} else {
		console.error("You are trying to clear a non-existing tracking thread");
	}
}

function trackingSuccess(position) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	console.log("Position changed (" + lat + "," + lng + ")");

	// Logic part
	updateCurrentPosition(lat, lng);

	// UI part
	var center = new google.maps.LatLng(lat, lng);
	map.setCenter(center);
	moveBlueMarker(center);
	$('speed').empty().append(
			"You are travelling at speed " + Math.round(curSpeed * 10) / 10
					+ "m/s");
}

function trackingFailure(position) {
	console.error("You had an error trying to call the navigator API");
}
