var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var origin = null;
var destination = null;
var waypoints = [];
var markers = [];
var blueMarker;
var directionsVisible = false;
var date = new Date();
var cur_hour = 0;
var cur_min = 0;
var cTime = 0;
var gTime = 0;
var tTime = 0;
var rTime = 0;
var get_t_Time = new Date();
var get_c_Time = new Date();
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

//	console.log("Your position has changed to " + lat + " " + lng);
//	info.empty().append("Your position has changed to"+ lat + " " + lng);

	if (curLoc != null) {
		var distance = calDistance(lat, curLoc.lat(), lng, curLoc.lng())
		curSpeed = distance / updateInterval;
//		console.log("You are now walking at speed " + curSpeed + "m/s");
//		info.empty().append("You are now walking at speed "+ curSpeed + "m/s");
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
	google.maps.event.addListenerOnce(map, 'click', function(event) {
		destination = event.latLng;
		addMarker(destination);
	});

	trackingRoutine();
}

function addMarker(latlng) {
	markers.push(new google.maps.Marker({
		position : latlng,
		map : map,
//		icon : "http://maps.google.com/mapfiles/marker" + String.fromCharCode(markers.length + 65) + ".png"
	}));
}

function addBlueMarker(latlng) {
	if (blueMarker != null) {
		blueMarker.setMap(null);
	}
//	blueMarker = new google.maps.Circle({
//		center : latlng,
//		map : map,
//		clickable : false,
//		fillColor : '#0fb0f2',
//		radius : 4,
//	})
	blueMarker = new google.maps.Marker({
	      position: latlng,
	      map: map,
	      icon: "img/dot.png"
	});
}

function calcRoute() {

//	alert("you click the go!");
	tTime = document.getElementById("time").value;
	cTime = getCurrentTime();
	get_t_Time = setTime(tTime);
	get_c_Time = setTime(cTime);
	
	if (get_t_Time<=get_c_Time)
	{
		alert("target time is less than current time!");
	}

	if (origin == null) {
		origin = curLoc;
	}

	if (destination == null) {
		alert("Click on the map to add an end point");
		return;
	}

	var mode = google.maps.DirectionsTravelMode.WALKING;

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
			gTime = response.routes[0].legs[0].duration.value;
			update(0,get_c_Time,get_t_Time,gTime);
			console.log(gTime);
//			info.empty().append("Google Time: " + gTime + " secs");
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

function resetAll() {
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
			map.setZoom(17);
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		handleNoGeolocation(false);
	}
}

function stop() {
	resetAll();
	info.parent().parent().removeAttr('class');
	info.parent().toggle().siblings().toggle();
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
	var TTime = new Date();
	TTime.setHours(time_array[0],time_array[1]);
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
