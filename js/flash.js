var flashBody = $('#ui');
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
	setTimeout(function() {
		flashBody.animate({
			opacity : 0
		}, withinFlashInterval[conf])
	}, 0);
	setTimeout(function() {
		flashBody.animate({
			opacity : 1
		}, withinFlashInterval[conf]);
	}, withinFlashInterval[conf]);
}

function flash(conf) {
	curFlashId = setTimeInterval(function() {
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
