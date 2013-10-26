var notifyInterval = 10; // in s
var updateInterval = 5; // in s
var estimateTime = 0;

function startWalking() {
	//changeUrl();
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

function goLater()
{
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
		alert("Click on the map to add your destination");
		return;
	} else {
		destination = marker.position;
	}
	calEstimateTime();
	alert("targetTime: " + targetTime);
}

//get distance from destination and calculate possible time
function calEstimateTime() {
	var request = {
		origin : curLoc,
		destination : destination,
		travelMode : google.maps.DirectionsTravelMode.WALKING,
		optimizeWaypoints : true,
	};
	directionsService.route(request, function(response, status) {
		console.log("routing success");
		if (status == google.maps.DirectionsStatus.OK) {
			estimateTime = response.routes[0].legs[0].distance.value / defSpeed;
			//alert(estimateTime);
			timeToGo();
		}
	});
}

function timeToGo()
{
	estimateTime = estimateTime/60;
	alert(estimateTime+ "min");
	estimateTime = estimateTime*60*1000;
	var currentTime = new Date();
	var estTime = new Date();
	var leavingTime = new Date();
	leavingTime = targetTime.getTime() - estimateTime;
	leaveTime = new Date(leavingTime);
	alert("leavingTime: " + leaveTime);
	
	var rightNow = false;
	while(rightNow == false)
	{
	var aaa = new Date();
		var h=aaa.getHours();
		var m=aaa.getMinutes();
		var s=aaa.getSeconds();
		alert(h+" "+m+" "+s);
		if ((h == leaveTime.getHours())&&(m == leaveTime.getMinutes())&&(s == leaveTime.getSeconds()))
		{
			alert("it is time to leave!");
			rightNow = true;
		}
		
	}
}




