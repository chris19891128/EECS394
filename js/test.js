function test() {
	initialize();
	setTimeout(function() {
		// tooEarly(1000);
		// tooLate(1000);
		// justOk();
		// startTracking(5);
		// setTimeout(stopTracking, 20*1000);

		destination = new google.maps.LatLng(42.057928, -87.684592);
		startRecalRoute(5);
	}, 2000);
}