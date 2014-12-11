//get the dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var messageController = require('./messages/messageController');
var userController = require('./users/userController');
var roomController = require('./rooms/roomController');
var clearURL = '/storm.html/clear';

//serve static files
app.use(express.static(__dirname + '/../client') );
app.use(express.static(__dirname + '/../client/styles') );
app.use('/docs', express.static(__dirname + '/../docs')  )

//redirect blank url to index.html
app.get('/', function(req, res) {
  res.render('index');
});

//clear database when '/storm.html/clear' is visited
app.get(clearURL, function(req, res) {
  messageController.clearDB(req, res);
});

//open a socket between the client and server
io.on('connection', function(socket) {
  var sendFullMessageTree = function() {
    messageController.getFullMessageTree(function(messages) {
      io.emit('all messages', messages);
    });
  };

  //send all current messages to only the newly connected user
  messageController.getFullMessageTree(function(messages) {
    socket.emit('all messages', messages);
  });

  //send all current messages to all users when a new message has been added
  socket.on('new message', function(msg) {
    messageController.addNewMessage(msg, function() {
      sendFullMessageTree();
    });
  });

  //send all current messages to all users after a message has been edited
  socket.on('edit message',function(msg){
    messageController.editMessage(msg,function(){
      sendFullMessageTree();
    })
  });

  //send all current messages to all users after a message has been removed
  socket.on('remove message leaf',function(msg){
    messageController.removeMessage(msg,function(){
      sendFullMessageTree();
    });
  });


  /* room socket stuff */
  //Create room
  socket.on('new room',function(roomObj, userObj){
    roomController.addNewRoom(roomObj, userObj, function(isTaken){
      console.log('addNewRoom');
      //emit back to client
      if (isTaken) {
        console.log('room Name Taken: ' + roomObj.name);
        socket.emit('room taken', true);
      }
      else {
        console.log("NEW ROOM");
        socket.emit('created room', roomObj);
      }
    });
  });
  //Enter room
  socket.on('enter room', function(roomName, roomPass, userObj){
    roomController.enterRoom(roomName, roomPass, userObj, function(isAuthentic){
      if(isAuthentic) {
        socket.emit('entered room', roomObj);
      }
      else {
        socket.emit('wrong room password', true);
      }
    });
  });

  /* User socket stuff */
  //Sign-up
  socket.on('user sign up',function(userObj){
    console.log("INSIDE USER SIGN IN SOCKET", userObj);
    userController.addNewUser(userObj,function(isTaken){
      console.log('addNewUser');
      //emit back to client
      if (isTaken) {
        console.log('Username taken: ' + userObj.name);
        socket.emit('user taken', true);
      }
      else {
        console.log('CREATED NEW USER');
        socket.emit('created user', userObj);
      }
    });
  });
  //Login
  socket.on('user login', function(userName, userPass){
    userController.Login(userName, userPass, function(isAuthentic){
      if(isAuthentic) {
        socket.emit('logged in', userObj);
      }
      else {
        socket.emit('wrong user password', true);
      }
    });
  });
});

//start listening
var port = process.env.PORT || 8000;
http.listen(port, function() {
  console.log("Listening to port 8000");
});
