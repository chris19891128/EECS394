function update(cSpeed, cTime, tTime, gTime) {
	rTime = (tTime.getTime() - cTime.getTime())/1000;
	var i=0;
	console.log(rTime);
	console.log(gTime);
	if (gTime + 90 < rTime){
		clearTimeout(f);
		flash('slow');
		i = Math.round((rTime - gTime)/60);
		info.parent().parent().removeAttr('class').addClass('relax');
		info.empty().append("Relax! You will arrive at your location " + i + " mins earlier :)");
	} else if (gTime - 90 > rTime) {
		clearTimeout(f);
		flash('fast');
		i = Math.round((gTime - rTime)/60);
		info.parent().parent().removeAttr('class').addClass('hurry');
		info.empty().append("Hurry! You will arrive at your destination " + i + " mins late!")
	} else {
		clearTimeout(f);
		flash('medium');
		info.parent().parent().removeAttr('class').addClass('ontime');
		info.empty().append("Just keep up, you will be on time :)")
	}
	info.parent().toggle().siblings().toggle();
}