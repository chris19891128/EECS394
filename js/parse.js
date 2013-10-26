Parse.initialize("XbH3LgwssgZUmFscklHUgX3yAjRa8yyTTx8lOtZi",
		"AmcmpSx446bhbOJaZwRsk2o7bUjfsXUfvi0VbEJo");

var MyUser = Parse.Object.extend("MyUser", {
	defaults : {
		avgSpeed : 1.3,

	}
});

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
	var query = new Parse.Query(MyUser);
	query.get(id,{
		success : function(u) {
			user = u;
		},
		error : function(u, error) {
			alert('Failed to retrieve object (does not exist), with error code: '+ error.description);
		}
	});
}

function addUser() {
	user = new MyUser();
	user.set("StartLocation", 123);
	user.set("Destination", 321);
	user.set("AverageSpeed", 222);

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
