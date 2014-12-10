//get the dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var messageController = require('./messages/messageController');

//serve static files
app.use(express.static(__dirname + '/../client') );
app.use(express.static(__dirname + '/../client/styles') );
app.use('/docs', express.static(__dirname + '/../docs')  )

//redirect blank url to index.html
app.get('/', function(req, res) {
  res.render('index');
});

//clear database when '/storm.html/clear' is visited
app.get('/storm.html/clear', function(req, res) {
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

  //
  socket.on('new room',function(lobbyObj){
    lobbyController.addNewLobby(lobbyObj, function(){
      console.log('addNewLobby');
      //emit back to client
      //io.emit('created lobby');
    });
  });

  socket.on('user sign in',function(userObj){
    userController.addNewUser(userObj,function(){
      console.log('addNewUser');
      //emit back to client
      //io.emit('created user');
    });
  });
});

//start listening
var port = process.env.PORT || 8000;
http.listen(port);
