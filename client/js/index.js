  //index.html logic
$(document).ready(function(){

	var socket = new Socket();
  var username;
  var roomName;
  var roomNameSelected;

  //On signup click, send username and password
  $('#signUpButton').on('click', function(e) {
  	e.preventDefault();

  	username = $('#signUpUsername').val();
  	var password = $('#signUpPassword').val();

    $('#signUpUsername').val('');
    $('#signUpPassword').val('');

    console.log(username);

    socket.userSignUp(username, password);

    $('#signUpUsername').val('');
    $('#signUpPassword').val('');
  });

  //On creating a user, hide the sign up and log in button, display sign out, and show room
  socket.onCreatedUser(function(roomsObject) {
    if (roomsObject) {
      $('#navSignUp, #navLogIn').addClass('hidden');
      $('#navSignOut').removeClass('hidden');
      $('#signUpModal').modal('toggle');
      for (var i = 0; i < roomsObject.length; i++) {
        $('.RoomList').append("<li class='room' data-toggle='modal' data-target='#selectedRoomModal'>"+ roomsObject[i].name +"</li>");
      }
    }
  });

  //On log in click ,send username and password to server.js
  $('#logInButton').on('click', function(e){
    e.preventDefault(); 
    username = $('#logInUsername').val(); //should use userObj. 
    var password = $('#logInUsername').val();

    socket.userLogIn(username, password);

    $('#logInUsername').val('');
    $('#logInUsername').val('');
  });
  
  socket.onLoggedIn(function(roomsObject){
    if(roomsObject) {
      $('#navSignUp, #navLogIn').addClass('hidden'); 
      $('#navSignOut').removeClass('hidden'); 
      $('#logInModal').modal('toggle');
      for (var i = 0; i < roomsObject.length; i++) {
        $('.RoomList').append("<li class='room' data-toggle='modal' data-target='#selectedRoomModal'>"+ roomsObject[i].name +"</li>");
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
    roomPassword = $('#roomPassword').val();

    socket.createRoom(roomName, roomPassword, username); 

    $('#roomInputName').val('');
    $('#roomPassword').val('');
  }); 

  //on Button click, send the roomName over Sockets!
  socket.onCreatedRoom(function(truthy) {
    if (truthy) {
      $('.RoomList').append("<li class='room' data-toggle='modal' data-target='#selectedRoomModal'>"+ roomName +"</li>");
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

  $(document).on('click', '.room', function(){
    roomNameSelected = $(this).text();
  });

  $('#selectedRoomButton').on('click', function() {
    var password = $('#selectedRoomPassword').val();
    socket.enterRoom(roomNameSelected, password, username);
    $('#selectedRoomPassword').val('');
  });

  socket.onWrongRoomPassword(function(truthy) {
    $('#selectedRoomModalForm').addClass('has-error');
    $('#selectedRoomError').removeClass('hidden');
  });

  $('.close').on('click', function() {
    $('#logInModalForm').removeClass('has-error');
    $('#logInError').addClass('hidden');
    $('#signUpModalForm').removeClass('has-error');
    $('#signUpError').addClass('hidden');
    $('#selectedRoomModalForm').removeClass('has-error');
    $('#selectedRoomError').addClass('hidden');
  });

  socket.onEnteredRoom(function(roomObj){
    //hard-coded href
    socket.redirectToRoom(roomObj);
    window.location.href="http://localhost:8000/storm.html";
  });

}); 

