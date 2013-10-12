var flashBody = $('#ui');
var msg = $('#msg');

var betweenFlashInterval = {
	slow : 1200,
	medium : 800,
	fast : 300
};
var withinFlashInterval = {
	slow : 150,
	medium : 100,
	fast : 80
};
var curFlashId;

function flashOnce(conf) {
	//setTimeout(function() {
		console.log("dim");
		console.log("id is " + flashBody.html());
		flashBody.animate({
			background : '#0fb0f2',
			opacity : 1
		}, 1200, function() {
			console.log("finish dim");
		});
//	}, 0);

	// setTimeout(function() {
	// console.log("light");
	// flashBody.animate({
	// background : '#f35a16',
	// opacity : 1
	// }, withinFlashInterval[conf], function() {
	// console.log("finish light");
	// });
	// }, withinFlashInterval[conf]);
}

function flash(conf) {
	curFlashId = setInterval(function() {
		flashOnce(conf);
	}, betweenFlashInterval[conf]);
}

function stopFlash() {
	if (curFlashId != null) {
		clearInterval(curFlashId);
	} else {
		console.error("You tried to stop a non-existing flasing thread");
	}
}

function tooEarly(sec) {
	clearTimeout(f);
	flash('slow');
	flashBody.removeAttr('class').addClass('relax');
	msg.empty().append(
			"Relax! You will arrive at your location " + Math.round(sec / 60)
					+ " mins earlier :)");
}

function tooLate(sec) {
	clearTimeout(f);
	flash('fast');
	flashBody.removeAttr('class').addClass('hurry');
	msg.empty().append(
			"Hurry! You will arrive at your destination "
					+ Math.round(sec / 60) + " mins late!");
}

function justOk() {
	clearTimeout(f);
	flash('medium');
	flashBody.removeAttr('class').addClass('ontime');
	msg.empty().append("Just keep up, you will be on time :)");
}