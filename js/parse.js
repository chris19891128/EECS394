Parse.initialize("XbH3LgwssgZUmFscklHUgX3yAjRa8yyTTx8lOtZi", "AmcmpSx446bhbOJaZwRsk2o7bUjfsXUfvi0VbEJo");
      
var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({foo: "bar"}, {
	success: function(object) {
		$(".success").show();
	},
	error: function(model, error) {
		$(".error").show();
	}
});

