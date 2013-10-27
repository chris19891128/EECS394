Parse.initialize("XbH3LgwssgZUmFscklHUgX3yAjRa8yyTTx8lOtZi",
		"AmcmpSx446bhbOJaZwRsk2o7bUjfsXUfvi0VbEJo");

var UserProfile = Parse.Object.extend("UserProfile");

var WalkingSession = Parse.Object.extend("WalkingSession");

var user;

userInit();

function userInit() {
	var url = window.location.href.toString();
	if (url.indexOf("?") == -1) {
		// alert("New user!");
		addUser();
	} else {
		var id = url.split("?id=")[1];
		oldUser(id);
	}
}

function oldUser(id) {
	var query = new Parse.Query(UserProfile);
	query
			.get(
					id,
					{
						success : function(u) {
							user = u;
						},
						error : function(u, error) {
							alert('Failed to retrieve object (does not exist), with error code: '
									+ error.description);
						}
					});
}

function addUser() {
	user = new UserProfile();
	user.set("AverageSpeed", defSpeed);
	var rel = user.relation("History");
	user.save(null, {
		success : function(u) {
			location.replace(window.location.href.toString() + "?id=" + u.id);
			user = u;
		},
		error : function(u, error) {
			alert('Failed to create new object, with error code: '
					+ error.description);
		}
	});
}

function saveWalkingSession(orig_lat, orig_lng, dest_lat, dest_lng, start_time,
		end_time) {
	var ws = new WalkingSession();
	ws.set("Origin", [ orig_lat, orig_lng ]);
	ws.set("Destination", [ dest_lat, dest_lng ]);
	ws.set("StartTime", start_time);
	ws.set("EndTime", end_time);
	ws.set("User", user);
	ws.save(null, {
		success : function(w) {
			var relation = user.relation("History");
			relation.add(w);
			user.save();
		},
		error : function(w, error) {
			alert('Failed to save a walking session: ' + error.description);
		}
	});
}
