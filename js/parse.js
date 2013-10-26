Parse.initialize("XbH3LgwssgZUmFscklHUgX3yAjRa8yyTTx8lOtZi", "AmcmpSx446bhbOJaZwRsk2o7bUjfsXUfvi0VbEJo");

function addUser()
{
var User = Parse.Object.extend("User");
var user = new User();
user.set("StartLocation", 123);
user.set("Destination", 321);
user.set("AverageSpeed", 222);
 
user.save(null, {
  success: function(user) {
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + user.id);
  },
  error: function(user, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and description.
    alert('Failed to create new object, with error code: ' + error.description);
  }
});
}
