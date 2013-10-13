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

	setWalkingSession();
	startTracking(updateInterval);
	setTimeout(function(){
			startRecalRoute(notifyInterval)
	},1000);
	
	$('#msg').parent().toggle().siblings().toggle();

}

function stopWalking() {
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
