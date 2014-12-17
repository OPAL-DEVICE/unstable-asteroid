  //index.html logic
$(document).ready(function(){

	var socket = new Socket();
  var username, roomName, roomNameSelected;

////////////// SIGNING UP //////////////

  //On signup click, send username and password
  $('#signUpButton').on('click', function(e) {
  	e.preventDefault();
  	username = $('#signUpUsername').val();
  	var password = $('#signUpPassword').val();
    $('#signUpUsername').val('');
    $('#signUpPassword').val('');
    socket.userSignUp(username, password);
    $('#signUpUsername').val('');
    $('#signUpPassword').val('');
  });

  //On creating a user, hide the sign up and log in button, display sign out, and show room
  socket.onCreatedUser(function(roomsObject) {
    if (roomsObject) {
      $('#navSignUp, #navLogIn').addClass('hidden');
      $('#navSignOut, #createRoom, .marketing').removeClass('hidden');
      $('#signUpModal').modal('toggle');
      for (var i = 0; i < roomsObject.length; i++) {
        $('.RoomList').append("<li class='room' data-toggle='modal' data-target='#selectedRoomModal'>"+ roomsObject[i].name +"</li>");
      }
    }
  });
//////////////////////////////////////////

////////////// LOGGING IN //////////////

  //On log in click ,send username and password to server.js
  $('#logInButton').on('click', function(e){
    e.preventDefault(); 
    username = $('#logInUsername').val(); //should use userObj. 
    var password = $('#logInPassword').val();
    console.log("CLIENT PASSWORD", password);
    socket.userLogIn(username, password);
    $('#logInUsername').val('');
    $('#logInPassword').val('');
  });
  
  //On logging in, does same thing as signing up
  socket.onLoggedIn(function(roomsObject){
    if(roomsObject) {
      $('#navSignUp, #navLogIn').addClass('hidden'); 
      $('#navSignOut, #createRoom, .marketing').removeClass('hidden'); 
      $('#logInModal').modal('toggle');
      for (var i = 0; i < roomsObject.length; i++) {
        $('.RoomList').append("<li class='room' data-toggle='modal' data-target='#selectedRoomModal'>"+ roomsObject[i].name +"</li>");
      }
    }
  });
//////////////////////////////////////////

////////////// ERRORS //////////////

  //All of the following highlights the input with red and shows error message
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

  socket.onRoomTaken(function(truthy) {
  	if (truthy) {
  		$('#roomForm').addClass('has-error');
      $('#roomError').removeClass('hidden');
    }
  });

  socket.onWrongRoomPassword(function(truthy) {
    $('#selectedRoomModalForm').addClass('has-error');
    $('#selectedRoomError').removeClass('hidden');
  });
//////////////////////////////////////////

////////////// ROOMS //////////////

  //On addRoomBtn, sends roomname, password, and username to server.js
  $('#addRoomBtn').on('click', function(e){
    e.preventDefault();
    roomName = $('#roomInputName').val();
    roomPassword = $('#roomPassword').val();

    socket.createRoom(roomName, roomPassword, username); 

    $('#roomInputName').val('');
    $('#roomPassword').val('');
  }); 

  //On creating a room, appends the room to the room list (can't be done without having logged in or signed up)
  socket.onCreatedRoom(function(truthy) {
    if (truthy) {
      $('.RoomList').append("<li class='room' data-toggle='modal' data-target='#selectedRoomModal'>"+ roomName +"</li>");
      $('#roomForm').removeClass('has-error');
      $('#roomError').addClass('hidden');
    }
  });

  //Selects room
  $(document).on('click', '.room', function(){
    roomNameSelected = $(this).text();
  });

  //Sends room name, room password, and username to server.js
  $('#selectedRoomButton').on('click', function() {
    var roomPassword = $('#selectedRoomPassword').val();
    socket.enterRoom(roomNameSelected, roomPassword, username);
    $('#selectedRoomPassword').val('');
  });
//////////////////////////////////////////


////////////// SIGN OUT //////////////
  $(document).on('click', '#navSignOut', function() {
    $('#navSignUp, #navLogIn').removeClass('hidden');
    $('#navSignOut, #createRoom, .marketing').addClass('hidden');
    $('.room').remove();
  });
//////////////////////////////////////////

////////////// MISC //////////////
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
    window.location.pathname = "/storm.html";
  });
  socket.onExitedRoom(function(roomObj){
    console.log('Left', roomObj.roomname);
  });

}); 
//////////////////////////////////////////
