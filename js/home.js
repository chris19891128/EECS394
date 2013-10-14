var notifyInterval = 10; // in s
var updateInterval = 5; // in s

function startWalking() {

	var str = document.getElementById("time").value;
	if (str == null) {
		alert("Click on the time setting to add your target time");
		return;
	} else {
		targetTime = new Date();
		targetTime.setHours(str.split(":")[0], str.split(":")[1], 0);
		if(targetTime.getTime() < new Date().getTime()){
			alert("Target time is earlier than now. You are already late !");
			return;
		}
	}

	if (marker == null) {
		alert("Click on the map to add an end point");
		return;
	} else {
		destination = marker.position;
	}

	google.maps.event.removeListener(listener);
	clearMarkers();

	setWalkingSession();
	startTrackingPosition(updateInterval, true);
	startRecalRoute(notifyInterval)

	$('#msg').parent().toggle().siblings().toggle();
}

function stopWalking() {
	$('#msg').parent().parent().removeAttr('class');
	$('#msg').parent().toggle().siblings().toggle();
	
	resetAll();
	
	resetWalkingSession();
	stopTrackingPosition();
	stopRecalRoute();
	
	listener = google.maps.event.addListener(map, 'click', function(event) {
		clearMarkers();
		addMarker(event.latLng);
	});
	
	location.reload();
}
