var notifyInterval = 10; // in s
var updateInterval = 5; // in s

function startWalking() {
	// changeUrl();
	var str = document.getElementById("time").value;
	if (str == null) {
		alert("Click on the time setting to add your target time");
		return;
	} else {
		targetTime = new Date();
		targetTime.setHours(str.split(":")[0], str.split(":")[1], 0);
		if (targetTime.getTime() < new Date().getTime()) {
			alert("Target time is earlier than now. You are already late !");
			return;
		}
	}

	if (marker == null) {
		alert("Click on the map to add your destination");
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
	$('#cancel').toggle();
}

function stopWalking() {
	endWalkingSession();

	// origin , destination , arrival time, start time
	saveWalkingSession(origin.lat(), origin.lng(), destination.lat(),
			destination.lng(), startTime, arrivalTime);

	setTimeout(function() {
		// Clean up everything
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
	}, 1000);
}
