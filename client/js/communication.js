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
Socket.prototype.createRoom = function(roomName, userName){
  console.log("INSIDE CLIENT CREATEROOM");
  var room = {name: roomName};
  var user = {name: userName};
  this.connection.emit('new room', room, user);
}

//sends user information to server. 
Socket.prototype.userSignUp = function(username, password){
  console.log("INSIDE CLIENT USERSIGNUP");
  this.connection.emit('user sign up', {name: username, password: password}); 
}

Socket.prototype.userLogIn = function(username, password){
  console.log("inside client user login"); 
  this.connection.emit('user login', {name: username, password: password}); 
};

//sends room info to authenticate
Socket.prototype.enterRoom = function(roomName, roomPass, userObj) {
  this.connection.emit('enter room', roomName, roomPass, userObj);
}

//Sets callback for when 'all messages' event is recieved
Socket.prototype.onAllMessages = function(callback){
  this.connection.on('all messages', function(messageReceived){
    callback(messageReceived);
  });
};

Socket.prototype.onRoomTaken = function(callback) {
  this.connection.on('room taken', function(truthy) {
    console.log("TRIGGER ONROOMTAKEN");
    callback(truthy);
  });
}

Socket.prototype.onUserTaken = function(callback) {
  this.connection.on('user taken', function(truthy) {
    console.log('INSIDE CLIENT ONUSERTAKEN');
    callback(truthy);
  })
}

Socket.prototype.onWrongRoomPassword = function() {

}

Socket.prototype.onWrongUserPassword = function() {
  this.connection.on('wrong user password', function(truthy){
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

//from server. actual method calls on app.js
Socket.prototype.onEnteredRoom = function(callback) {
  this.connection.on('entered room', function(sessionId, token) {
    callback(sessionId, token);
  });
}

//Sets callback for when 'all messages' event is recieved
Socket.prototype.onAllMessages = function(callback){
  this.connection.on('all messages', function(messageReceived){
    callback(messageReceived);
  });
};


Socket.prototype.onLoggedIn = function(callback) {
  this.connection.on('logged in', function(truthy){
    callback(truthy); 
  }); 
}

//Sends message with edit event
Socket.prototype.sendRoom = function(message){
  this.connection.emit('new room', message);
};
