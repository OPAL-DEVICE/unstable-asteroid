  //index.html logic
$(document).ready(function(){

	var socket = new Socket();

//on Button click, send the roomName over Sockets!
  $('#addRoomBtn').on('click', function(e){
  	e.preventDefault(); 
    var roomName = $('#roomInputName').val(); 
   	
   	$('.RoomList').append('<li>'+roomName+'</li>');

   	socket.createRoom(roomName); 

  });

  //On login click, send username and password
  $('#logInButton').on('click', function(e) {
  	e.preventDefault();

  	var username = $('#username').val();
  	var password = $('#password').val();

  	socket.userSignIn(username, password);
  });

    //Set listener
  socket.onRoomTaken(function(trucey) {
  	if (trucey) {
  		$('#roomForm').addClass('has-error');
  	}
  });

}); 

