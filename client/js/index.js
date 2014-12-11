  //index.html logic
$(document).ready(function(){

	var socket = new Socket();
  var username;
  var roomName;

  //On login click, send username and password
  $('#signUpButton').on('click', function(e) {
  	e.preventDefault();

  	username = $('#signUpUsername').val();
  	var password = $('#signUpPassword').val();
    $('#signUpUsername').val('');
    $('#signUpPassword').val('');

    console.log(username);

  	socket.userSignUp(username, password);
  });

  socket.onCreatedUser(function(truthy) {
    if (truthy) {
      $('#navSignUp, #navLogIn').addClass('hidden'); 
      $('#navSignOut').removeClass('hidden');
      $('#signUpModal').modal('toggle');
    }
  });

  $('#logInButton').on('click', function(e){
    e.preventDefault(); 
    username = $('#logInUsername').val(); //should use userObj. 
    var password = $('#logInPassword').val();

    socket.userLogIn(username, password);
  });
  
  socket.onLoggedIn(function(roomsObject){
    if(roomsObject) {
      $('#navSignUp, #navLogIn').addClass('hidden'); 
      $('#navSignOut').removeClass('hidden'); 
      $('#logInModal').modal('toggle');
      for (var key in roomsObject) {
        
      }
    }
  });

  socket.onUserTaken(function(truthy) {
    if (truthy) {
      $('#signUpModalForm').addClass('has-error');
      $('#signUpError').removeClass('hidden');
    }
  });

  socket.onWrongUserPassword(function(truthy) {
    if (truthy) {
      $('#logInModalForm').addClass('has-error');
      $('#logInError').removeClass('hidden');
    }
  });

  $('#addRoomBtn').on('click', function(e){
    e.preventDefault();
    roomName = $('#roomInputName').val(); 
    $('#roomInputName').val('');
    socket.createRoom(roomName, username); 
  }); 

  //on Button click, send the roomName over Sockets!
  socket.onCreatedRoom(function(truthy) {
    if (truthy) {
      $('.RoomList').append('<li>'+roomName+'</li>');
      $('#roomForm').removeClass('has-error');
      $('#roomError').addClass('hidden');
    }
  });

  //Set listener
  socket.onRoomTaken(function(truthy) {
  	if (truthy) {
  		$('#roomForm').addClass('has-error');
      $('#roomError').removeClass('hidden');
  	}
  });

  $('.close').on('click', function() {
    $('#logInModalForm').removeClass('has-error');
    $('#logInError').addClass('hidden');
    $('#signUpModalForm').removeClass('has-error');
    $('#signUpError').addClass('hidden');
  });

}); 

