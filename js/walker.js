// User inputs
var destination = null;
var targetTime = null;
var accDistance = 0; // in m, accumulated distance traveled
var accTime = 0; // in s, accumulated time spent
var avgSpeed = null; // in s

// Internal states
var curSpeed; // in m/s
var curLoc;

function updateCurrentPosition(lat, lng) {
	if (curLoc != null) {
		var distance = calDistance(lat, curLoc.lat(), lng, curLoc.lng());
		accDistance = accDistance + distance;
		accTime = accTime + updateInterval;
		curSpeed = distance / updateInterval;
	} 
	curLoc = new google.maps.LatLng(lat, lng);
}

function updateSuggestion(response) {
	var adjTime = response.routes[0].legs[0].distance.value / avgSpeed;
	var timeToDest = (targetTime.getTime() - new Date().getTime()) / 1000;
	if (timeToDest - adjTime > timeWindow) {
		return "early";
	} else if (timeToDest - adjTime < 0 - timeWindow) {
		return "late";
	} else {
		return "ok";
	}
}
