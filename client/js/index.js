  //index.html logic
$(document).ready(function(){

	var socket = new Socket();
  var username;

//on Button click, send the roomName over Sockets!
  $('#addRoomBtn').on('click', function(e){
  	e.preventDefault(); 
    var roomName = $('#roomInputName').val(); 
   	$('.RoomList').append('<li>'+roomName+'</li>');
    $('#roomInputName').val('');
   	socket.createRoom(roomName, username); 
  });

  //On login click, send username and password
  $('#signInButton').on('click', function(e) {
  	e.preventDefault();

  	username = $('#username').val();
  	var password = $('#password').val();
    console.log(username);

  	socket.userSignUp(username, password);
  });

  //Set listener
  socket.onRoomTaken(function(trucey) {
  	if (trucey) {
  		$('#roomForm').addClass('has-error');
  	}
  });

}); 

