
// Create a variable to reference the database.
var database = firebase.database();


// '.info/connected' is a special location provided by Firebase that is updated every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are 
// When the client's connection state changes...
database.ref(".info/connected").on("value", function(snap) {
	// If someone is connected..
	if( snap.val() ) {
		// Add user to the connections list.
		var con = database.ref("/connections").push(true);
		// Remove user from the connection list when they disconnect.
		con.onDisconnect().remove();
	};
});

// database.ref("/connections") references a secific location in our database.
// All of our connections will be stored in this directory.
// When first loaded or when the connections list changes...
database.ref("/connections").on("value", function(snap) {
	// Display the viewer count in the html.
	// The number of online users is the number of children in the connections list.
    console.log(snap.numChildren());
	$("#connected-viewers").text(snap.numChildren());
});

//on initial load, get a snapshot.  also if any values change, get a snapshot.
database.ref("/chatdata").on("child_added", function(childSnapshot){
	// Console.log the initial "snapshot" value (the object itself)
    console.log("child added");
    //update the chat window by adding the latest chat
    var latestMessage = $("<p>");
    latestMessage.addClass("chat-text");
    latestMessage.text(childSnapshot.val().message);
    $("#chat-display").append(latestMessage);
}, function(errorObject){
	alert("firebase encountered an error");
});
//let everyone know a new player is watching the chat by adding a child
database.ref("/chatdata").push({
	message: "<-- a new user has entered chat -->",
    dateAdded: firebase.database.ServerValue.TIMESTAMP
}); 


//add "on click" function to the login form's button to submit player info
$("#login-form-btn").on("click", function(){

    //return false so it doesnt reload page
    return false;
})

//add "on click" function to the login form's button to submit player info
$("#chat-form-btn").on("click", function(){
    //debugger;
    //go get the message from the chat input 
    var newMessage = $("#chat-form-input").val().trim();
    //post the chat to the database
    database.ref("/chatdata").push({
        message: newMessage,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    //clear the value in the chat form after input
    $("#chat-form-input").val("");

    //return false so it doesnt reload page
    return false;
})
