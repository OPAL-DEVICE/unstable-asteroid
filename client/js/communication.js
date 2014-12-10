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
  console.log("CREATED ROOM");
  this.connection.emit('new room', roomName, userName); 
}

//sends user information to server. 
Socket.prototype.userSignIn = function(username, password){
  console.log("INSIDE CLIENT USERSIGNIN");
  this.connection.emit('user sign in', {name: username, password: password}); 
}

//Sets callback for when 'all messages' event is recieved
Socket.prototype.onAllMessages = function(callback){
  this.connection.on('all messages', function(messageReceived){
    callback(messageReceived);
  });
};

Socket.prototype.onRoomTaken = function(callback) {
  this.connection.on('room taken'), function(trucey) {
    callback(trucey);
  }
}

Socket.prototype.onUserTaken = function() {

}

Socket.prototype.onWrongRoomPassword = function() {

}

Socket.prototype.onWrongUserPassword = function() {

}

Socket.prototype.onCreatedUser = function() {

}

Socket.prototype.onCreatedRoom = function() {

}

Socket.prototype.onEnteredRoom = function() {

}

Socket.prototype.onLoggedIn = function() {

}

//Sends message with edit event
Socket.prototype.sendRoom = function(message){
  this.connection.emit('new room', message);
};
