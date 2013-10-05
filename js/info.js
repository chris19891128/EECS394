function update(cSpeed, cTime, tTime, gTime) {
	info.parent().toggle().siblings().toggle();
	cTime = new Date();
	tTime = new Date("2013-10-04T23:21:45.504Z");
	gTime = 1000;
	var rTime = tTime.getMilliseconds() - cTime.getMilliseconds();
	var i=0;
	console.log(rTime);
	if (gTime + 90 > rTime){
		i = Math.round((gTime - rTime)/60);
		info.parent().parent().addClass('relax');
		info.empty().append("Relax! You will arrive at your location " + i + " mins earlier :)");
	} else if (gTime - 90 < rTime) {
		i = Math.round((rTime - gTime)/60);
		info.parent().addClass('hurry');
		info.empty().append("Hurry! You will arrive at your destiny " + i + " mins late!")
	} else {
		info.parent().addClass('ontime');
		info.empty().append("Just keep up, you will be on time :)")
	}
}