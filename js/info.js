function update(cSpeed, cTime, tTime, gTime) {
	info.parent().toggle().siblings().toggle();
	cTime = new Date();
	tTime = new Date("2013-10-05T22:21:45.504Z");
	gTime = 1000;
	var rTime = tTime.getMilliseconds() - cTime.getMilliseconds();
	if (gTime > rTime){
		info.empty().append("Relax!");
	} else {
		info.empty().append("Hurry!")
	}
}