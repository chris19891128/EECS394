var marker;
var blueMarker;
var listener;

function registerMapClickListener() {
	listener = google.maps.event.addListener(map, 'click', function(event) {
		clearMarkers();
		addMarker(event.latLng);
	});
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