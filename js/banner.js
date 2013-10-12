function tooEarly(sec) {
	stopFlash();
	flash('slow');
	$('#ui').removeAttr('class').addClass('relax');
	$('#msg').empty().append(
			"Relax! You will arrive at your location " + Math.round(sec / 60)
					+ " mins earlier :)");
}

function tooLate(sec) {
	stopFlash();
	flash('fast');
	$('#ui').removeAttr('class').addClass('hurry');
	$('#msg').empty().append(
			"Hurry! You will arrive at your destination "
					+ Math.round(sec / 60) + " mins late!");
}

function justOk() {
	stopFlash();
	flash('medium');
	$('#ui').removeAttr('class').addClass('ontime');
	$('#msg').empty().append("Just keep up, you will be on time :)");
}

function updateSuggestion(response){
	var decision = decide(response);
	if (decision[0] == "early") {
		tooEarly(decision[1]);
	} else if (decision[0] == "late") {
		tooLate(decision[1]);
	} else {
		justOk();
	}
}