function tooEarly(sec) {
	stopFlash();
	flash('slow');
	$('#ui').removeAttr('class').addClass('relax');
	$('#msg').empty().append("Relax");
	$('#detail').empty().append("You will be <strong>" + Math.round(sec / 60)
			+ "</strong> mins earlier");
}

function tooLate(sec) {
	stopFlash();
	flash('fast');
	$('#ui').removeAttr('class').addClass('hurry');
	$('#msg').empty().append("Hurry");
	$('#detail').empty().append("You will be <strong>" + Math.round(sec / 60) + "</strong> mins late");
}

function justOk() {
	stopFlash();
	flash('medium');
	$('#ui').removeAttr('class').addClass('ontime');
	$('#msg').empty().append("Keep Up");
	$('#detail').empty().append("You will be on time :)");
}

function updateSuggestionBanner(response) {
	var decision = decide(response);
	if (decision[0] == "early") {
		tooEarly(decision[1]);
	} else if (decision[0] == "late") {
		tooLate(decision[1]);
	} else if (decision[0] == "ok") {
		justOk();
	} else if (decision[0] == "undefined") {
		// Do nothing here.
	}
}

function updateSpeedBanner() {
	if (curSpeed != null) {
		$('#speed').empty().append(
				"You are travelling at speed " + Math.round(curSpeed * 10) / 10
						+ "m/s");
	}
}