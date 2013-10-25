Parse.initialize("XbH3LgwssgZUmFscklHUgX3yAjRa8yyTTx8lOtZi", "AmcmpSx446bhbOJaZwRsk2o7bUjfsXUfvi0VbEJo");

function currentUser() {
	var currentUser = Parse.User.current();
	if (currentUser) {
		alert("login already with email " + currentUser.getEmail());
	} else {
		alert("You are not log in");
	}
}

function signUp() {
	var user = new Parse.User();
	user.set("username", document.getElementById("usrname").value);
	user.set("password", document.getElementById("pwd").value);
	user
			.set("email", document.getElementById("usrname").value
					+ "@example.com");

	user.signUp(null, {
		success : function(user) {
			alert("SIGNUP success with email " + user.getEmail());
		},
		error : function(user, error) {
			// Show the error message somewhere and let the user try again.
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function logIn() {
	Parse.User.logIn(document.getElementById("usrname").value, document
			.getElementById("pwd").value, {
		success : function(user) {
			alert("login success with email " + user.email);
			window.navigate("../../default.html");  
			alert("login success with email " + user.getEmail());
		},
		error : function(user, error) {
			// The login failed. Check error to see why.
		}
	});
}