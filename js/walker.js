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
var defSpeed = 1.3;
var history = [ defSpeed, defSpeed, defSpeed, defSpeed ];

var inWalk = false;

function updateWalkingInfo(lat, lng) {
	if (inWalk == true) {
		var distance = calDistance(lat, curLoc.lat(), lng, curLoc.lng());
		curSpeed = distance / updateInterval;
		adjustError();
		avgSpeed = (history[1] + history[2] + history[3] + curSpeed) / 4;
		for (var i = 0; i < 3; i++) {
			history[i] = history[i + 1];
		}
		history[3] = curSpeed;
		console.log("Average speed for the past " + accTime + " seconds is "
				+ avgSpeed);
	}
	curLoc = new google.maps.LatLng(lat, lng);
}

function adjustError() {
	curSpeed = curSpeed < 0.4 ? 0 : curSpeed - 0.4;
}

function setWalkingSession() {
	accDistance = 0; // in m, accumulated distance traveled
	accTime = 0; // in s, accumulated time spent
	avgSpeed = defSpeed; // in s
	startTime = new Date();
	curSpeed = 0;
	inWalk = true;
}

function resetWalkingSession() {
	targetTime = null;
	destination = null;
	accDistance = null;
	accTime = null;
	avgSpeed = null;
	startTime = null;
	curSpeed = null;
	curLoc = null;
	inWalk = false;
}

function decide(response) {
	if (avgSpeed == null || curLoc == null || curSpeed == null) {
		return [ "undefined" ];
	}
	if (avgSpeed < 0.5) {
		return [ "standing" ];
	}

	var adjTime = response.routes[0].legs[0].distance.value / avgSpeed;
	var timeToDest = (targetTime.getTime() - new Date().getTime()) / 1000;
	if (timeToDest - adjTime > timeWindow) {
		return [ "early", timeToDest - adjTime ];
	} else if (timeToDest - adjTime < 0 - timeWindow) {
		return [ "late", adjTime - timeToDest ];
	} else {
		return [ "ok" ];
	}
}
