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
    console.log(username);

  	socket.userSignUp(username, password);
  });

  socket.onCreatedUser(function(truthy) {
    if (truthy) {
      $('#signUpModal').modal('toggle');
    }
  })

  $('#logInButton').on('click', function(e){
    e.preventDefault(); 
    username = $('#logInUsername').val(); //should use userObj. 
    var password = $('#logInPassword').val();

    socket.userLogIn(username, password); 
  })
  
  socket.onLoggedIn(function(truthy){
    if(truthy){
      $('#navSignUp').addClass("hidden"); 
      $('#navLogIn').addClass("hidden"); 
      $('#navBarUl').append("<li role='presentation'><a href='#' >Sign out</a></li>"); 
      $('#logInModal').modal('toggle');

    }
  })


  socket.onUserTaken(function(truthy) {
    if (truthy) {
      $('#signUpModalForm').addClass('has-error');
      $('#signUpError').removeClass('hidden');
    }
  })

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



}); 

