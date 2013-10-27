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

var locatingOptions = {
	enableHighAccuracy : true,
	timeout : 5000,
	maximumAge : 0
};

function initialize() {
	if (navigator.userAgent.match(/Android/i)) {
		window.scrollTo(0, 1);
	}
	var myOptions = {
		zoom : 17,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	initSearchBar();

	locatePosition(true);

	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));

	listener = google.maps.event.addListener(map, 'click', function(event) {
		clearMarkers();
		addMarker(event.latLng);
	});

}

function initSearchBar() {
	var searchInput = document.getElementById("searchBar");
	var searchBox = new google.maps.places.SearchBox(searchInput);
	google.maps.event.addListener(searchBox, 'places_changed', function() {
		var place = searchBox.getPlaces()[0];
		addMarker(place.geometry.location);
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(place.geometry.location);
		bounds.extend(curLoc);
		map.fitBounds(bounds);
		toggleSearchBar();
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

// Basic Locating service

function locatePosition(isCentered) {
	navigator.geolocation.getCurrentPosition(function(position) {
		updateWalkingInfo(position.coords.latitude, position.coords.longitude);
		updateCurrentPositionOnMap(isCentered)
	}, function() {
	}, locatingOptions);
}

// Advanced tracking service, used when walking

function trackPosition() {
	navigator.geolocation.getCurrentPosition(function(position) {
		console.log("new position " + position.coords.latitude + " and "
				+ position.coords.longitude);

		var newLat = position.coords.latitude;
		var newLng = position.coords.longitude;

		// Logic part
		updateWalkingInfo(newLat, newLng);

		// UI part
		updateCurrentPositionOnMap(false);
		// includeDestination();
		updateSpeedBanner();
	}, function() {
		console.error("Error tracking");
	}, locatingOptions);
}

function startTrackingPosition(interval) {
	trackingId = setInterval(trackPosition, interval * 1000);
	trackPosition();
}

function stopTrackingPosition() {
	if (trackingId != null) {
		clearInterval(trackingId);
	} else {
		console.error("You are trying to clear a non-existing tracking thread");
	}
}

// General purpose Map functions

function updateCurrentPositionOnMap(isCentered) {
	if (isCentered) {
		map.setCenter(curLoc);
	}
	moveBlueMarker(curLoc);
}

function includeDestination() {
	var bounds = new google.maps.LatLngBounds();
	bounds.extend(curLoc);
	bounds.extend(destination);
	map.fitBounds(bounds);
}

// Advanced route recalculating
function recalRoute() {
	var request = {
		origin : curLoc,
		destination : destination,
		travelMode : google.maps.DirectionsTravelMode.WALKING,
		optimizeWaypoints : true,
	};
	directionsService.route(request, function(response, status) {
		console.log("routing success");
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			updateSuggestionBanner(response); // banner do stuff
		}
	});
}

function startRecalRoute(interval) {
	routingId = setInterval(recalRoute, interval * 1000);
	recalRoute();
}

function stopRecalRoute() {
	if (routingId != null) {
		clearInterval(routingId);
	} else {
		console.error("You are trying to clear a non-existing routing thread");
	}
}

// Utility map functions
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
	// console.log("Before move " + latlng);
	if (blueMarker == null) {
		blueMarker = new google.maps.Marker({
			position : latlng,
			map : map,
			icon : "img/dot.png"
		});
	} else {
		blueMarker.setPosition(latlng);
	}
	// console.log("After move " + blueMarker.getPosition());
}

function removeBlueMarker() {
	if (blueMarker != null) {
		blueMarker.setMap(null);
	}
}

function trackingFailure(position) {
	console.error("You had an error trying to call the navigator API");
}
