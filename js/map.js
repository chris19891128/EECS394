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
	distributeID();
	if (navigator.userAgent.match(/Android/i)) {
		window.scrollTo(0, 1);
	}
	var myOptions = {
		zoom : 17,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	locatePosition(true);

	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));

	listener = google.maps.event.addListener(map, 'click', function(event) {
		clearMarkers();
		addMarker(event.latLng);
	});
}

//distribute id at the beginning.
function distributeID()
{
	addUser();
	var url =window.location.href; //获得当前url 
	var URL=url.toString();
	alert(URL);
	if(URL.indexOf("id")==-1){
		alert("there is no id!");
		var nc=123;
		var newadd="?id="+nc;//加到当前url之后 
		url=url+newadd; 
		alert(url); 
		location.replace(url);//装入这个新的url 
	}else{
		var id=URL.split("id=");
		alert(id[1]);
	   }
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
		curLoc = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude);
		updateCurrentPositionOnMap(isCentered)
	}, function() {
	}, locatingOptions);
}

// Advanced tracking service, used when walking

function trackPosition() {
	navigator.geolocation.getCurrentPosition(function(position) {
		console.log("new position");
		// Logic part
		updateWalkingInfo(position.coords.latitude, position.coords.longitude);

		// UI part
		updateCurrentPositionOnMap(false);
		includeDestination();
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


function trackingFailure(position) {
	console.error("You had an error trying to call the navigator API");
}
