//Socket class for sending/recieving messages from socket
//Creates connection on object creation 
var Socket = function(){
  this.connection = io();
};

//Sends message with new message event
Socket.prototype.sendMessage = function(message){
  this.connection.emit('new message', message);
};

//Sends message with edit event
Socket.prototype.sendEdit = function(message){
  this.connection.emit('edit message', message);
};

//Sends message with delete event
Socket.prototype.sendDelete = function(message){
  this.connection.emit('remove message leaf', message);
};

//Sends/creates a roomname to server.
Socket.prototype.createRoom = function(roomName, roomPassword, userName){
  console.log("INSIDE CLIENT CREATEROOM");
  var room = {name: roomName, password: roomPassword};
  var user = {name: userName};
  this.connection.emit('new room', room, user);
}

//sends user information to server. 
Socket.prototype.userSignUp = function(username, password){
  console.log("INSIDE CLIENT USER SIGNUP");
  this.connection.emit('user sign up', {name: username, password: password}); 
}

Socket.prototype.userLogIn = function(username, password){
  console.log("inside client user login"); 
  this.connection.emit('user login', {name: username, password: password}); 
};

Socket.prototype.enterRoom = function(roomName, password, userName) {
  console.log("INSIDE CLIENT ENTER ROOM");
  this.connection.emit('enter room', roomName, password, {username: userName});
}

//Sets callback for when 'all messages' event is recieved
Socket.prototype.onAllMessages = function(callback){
  this.connection.on('all messages', function(messageReceived){
    callback(messageReceived);
  });
};

Socket.prototype.onRoomTaken = function(callback) {
  this.connection.on('room taken', function(truthy) {
    console.log("TRIGGER ON ROOM TAKEN");
    callback(truthy);
  });
}

Socket.prototype.onUserTaken = function(callback) {
  this.connection.on('user taken', function(truthy) {
    console.log('INSIDE CLIENT ON USER TAKEN');
    callback(truthy);
  })
}

Socket.prototype.onWrongRoomPassword = function(callback) {
  this.connection.on('wrong room password', function(truthy) {
    console.log("INSIDE CLIENT WRONG ROOM PASSWORD");
    callback(truthy);
  })
}

Socket.prototype.onWrongUserPassword = function(callback) {
  this.connection.on('wrong user password', function(truthy){
    console.log("INSIDE CLIENT WRONG USER PASSWORD");
    callback(truthy);
  });
}

Socket.prototype.onCreatedUser = function(callback) {
  this.connection.on('created user', function(truthy) {
    callback(truthy);
  });
}

Socket.prototype.onCreatedRoom = function(callback) {
  this.connection.on('created room', function(truthy) {
    callback(truthy);
  });
}

Socket.prototype.onEnteredRoom = function(callback){
  this.connection.on('entered room', function(roomObj){
    console.log("ON ENTERED ROOM IN COMMUNICATION.JS")
    callback(roomObj);
  });
}

Socket.prototype.onLoggedIn = function(callback) {
  this.connection.on('logged in', function(truthy){
    callback(truthy);
  });
}

Socket.prototype.redirectToRoom = function(roomObj){
  console.log("IN redirectToRoom");
  this.connection.emit("redirect to storm", true);
}

Socket.prototype.onRedirectToRoom = function(callback) {
  this.connection.on("redirected to storm", function(roomObj){
    console.log("IN onRedirectToRoom");
    callback(roomObj);
  });
}

