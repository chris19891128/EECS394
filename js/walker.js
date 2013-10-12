// User inputs
var destination = null;
var targetTime = null;
var startTime = null;
var accDistance = null; // in m, accumulated distance traveled
var accTime = null; // in s, accumulated time spent
var avgSpeed = null; // in s

// Internal states
var curSpeed; // in m/s
var curLoc;

// Math constants
var timeWindow = 90;

var inWalk = false;

function updateCurrentPosition(lat, lng) {
	if (inWalk == true) {
		var distance = calDistance(lat, curLoc.lat(), lng, curLoc.lng());
		curSpeed = distance / updateInterval;
		accDistance = accDistance + distance;
		accTime = (new Date().getTime() - startTime.getTime()) / 1000;
		accSpeed = accDistance / accTime;
		console.log("Average speed for the past " + accTime + " seconds");
	}
	curLoc = new google.maps.LatLng(lat, lng);
}

function setWalkingSession() {
	accDistance = 0; // in m, accumulated distance traveled
	accTime = 0; // in s, accumulated time spent
	avgSpeed = null; // in s
	startTime = new Date();
	inWalk = true;
}

function resetWalkingSession(){
	accDistance = null; 
	accTime = null; 
	avgSpeed = null; 
	startTime = null;
	inWalk = false;
}

function decide(response) {
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
