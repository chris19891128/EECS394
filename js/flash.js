var f; //SetTimeout

function flash(conf) {
	if (conf == "slow") {
//		navigator.vibrate(500);
		info.parent().parent().animate({opacity: 0},150,function(){
			info.parent().parent().animate({opacity: 1}, 150, function(){
			f = setTimeout(function(){
					flash("slow");
				},1200);
			});
		});
	} else if (conf == "medium") {
//		navigator.vibrate(200);
		info.parent().parent().animate({opacity: 0},100,function(){
			info.parent().parent().animate({opacity: 1}, 100, function(){
			f = setTimeout(function(){
					flash("medium");
				},800);
			});
		});
	} else if (conf == "fast"){
//		navigator.vibrate(200);
		info.parent().parent().animate({opacity: 0},80,function(){
			info.parent().parent().animate({opacity: 1}, 80, function(){
			f = setTimeout(function(){
					flash("fast");
				},300);
			});
		});		
	}
}
