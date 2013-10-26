var notifyInterval = 10; // in s
var updateInterval = 5; // in s

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

function changeUrl() 
{ 
   var url =window.location.href; //获得当前url 
   var URL=url.toString();
   alert(URL);
   if(URL.indexOf("id")==-1){
	   alert("there is no id!");
	   var nc=123;//获得一个随机数字 
	   var newadd="?id="+nc;//加到当前url之后 
	   url=url+newadd; 
	   alert(url); 
	   location.replace(url);//装入这个新的url 
   }else{
	   var id=URL.split("id=");
	   alert(id[1]);
   }
   
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
