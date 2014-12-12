//get the dependencies
var express = require('express');
var app = express();
OpenTok = require('opentok');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var messageController = require('./messages/messageController');
var userController = require('./users/userController');
var roomController = require('./rooms/roomController');
var clearURL = '/storm.html/clear';


// //start app
// function init() {
//   app.listen(3000, function() {
//     console.log('app running on ' + 3000);
//   });
// };


//serve static files
app.use(express.static(__dirname + '/../client') );
app.use(express.static(__dirname + '/../client/styles') );
app.use('/docs', express.static(__dirname + '/../docs')  );

//redirect blank url to index.html
app.get('/', function(req, res) {
  // res.render('storm');
  res.render('index');
});

//clear database when '/storm.html/clear' is visited
app.get(clearURL, function(req, res) {
  messageController.clearDB(req, res);
});

//open a socket between the client and server
io.on('connection', function(socket) {
  var sendFullMessageTree = function(roomObj) {
    messageController.getFullMessageTree(roomObj, function(messages) {
      io.emit('all messages', messages);
    });
  };

  //send all current messages to only the newly connected user
  // messageController.getFullMessageTree(roomObj, function(messages) {
  //   socket.emit('all messages', messages);
  // });

  //send all current messages to all users when a new message has been added
  socket.on('new message', function(roomObj, msg) {
    messageController.addNewMessage(msg, function() {
      sendFullMessageTree(roomObj);
    });
  });

  //send all current messages to all users after a message has been edited
  socket.on('edit message',function(msg){
    messageController.editMessage(msg,function(){
      sendFullMessageTree();
    });
  });

  //send all current messages to room after a message has had a file attached
  socket.on('add file', function(msg) {
    messageController.addFileToMessage(msg, function(){
      sendFullMessageTree();
    });
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
    roomController.enterRoom(roomName, roomPass, userObj, function(isAuthentic, roomObj){
      if(isAuthentic) {
        sendFullMessageTree(roomObj);

        //if entered room. start an opentok session so user can connect via video/audio
        var apiKey = "45105222";
        var apiSecret = "dcc51506615e5c2f67b77ae57c1eba1860e387b7";
        // Initialize OpenTok and store it in the express app
        var opentok = new OpenTok(apiKey, apiSecret);
        // Create a session and store it in the express app -- use when making new lobby
        roomController.getSessionId(roomName, function(returnedVal) {
          //if exists
          var sessionId;
          var token;
          if (returnedVal !== '') { 
            sessionId = returnedVal;
          } else {
            //create a sessionId
            opentok.createSession({}, function(error, session) {
              if (error) {
                console.log("error creating a session: " + error);
              } else {
                sessionId = session.sessionId;
                roomController.addSession(roomName, sessionId, function(isSaved) {
                  if (isSaved) {
                    console.log('saved');
                  }
                });
                console.log("Session ID: " + sessionId);
              }

              var tokenOptions = {};
                  tokenOptions.role = "publisher";
              // Generate a token.
              token = opentok.generateToken(sessionId, tokenOptions);
              console.log(token);

              app.listen(3000, function() {
                  console.log('app running on ' + 3000);
                });
              //sends signal back to client
              socket.emit("entered room", sessionId, token);

            });
          }
        });

        // }) 
        // opentok.createSession(function(err, session) {
        //   if (err) throw err;
        //   app.set('sessionId', session.sessionId);
        //   console.log(session.sessionId);
        //   // starts the app

        //   var sessionId = session.sessionId;
        //   console.log("Session ID: " + sessionId);
        //   var tokenOptions = {};
        //   tokenOptions.role = "publisher";
        //   tokenOptions.data = "username=" + userObj.name;
       
        //   // Generate a token.
        //   var token = opentok.generateToken(sessionId, tokenOptions);
        //   console.log(token);

        //   // init();
        //   //necessary????
        //   http.listen(port, function() {
        //     console.log("Listening to port 8000");
        //   });
        //   socket.emit("entered room", sessionId, token);
        // });
        // //socket.emit('entered room', roomObj);

      }
      else {
        socket.emit('wrong room password', true);
      }
    });
  });
  //Exit
  socket.on('exit room', function(roomObj, userName){
    roomController.exitRoom(roomObj, userName, function(room){
      socket.emit('exited room', room);
    });
  }); 

  /* User socket stuff */
  //Sign-up
  socket.on('user sign up',function(userObj){
    userController.addNewUser(userObj,function(isTaken){
      if (isTaken) {
        socket.emit('user taken', true);
      }
      else {
        roomController.getAllRooms(function(rooms){
          console.log("USER SIGNED UP", rooms);
          socket.emit('created user', rooms);
        });
      }
    });
  });
  //Login
  socket.on('user login', function(userObj, userPass){
    userController.login(userObj, function(isAuthentic){
      if(isAuthentic) {
        roomController.getAllRooms(function(rooms){
          console.log("USER LOGGED IN", rooms);
          socket.emit('logged in', rooms);
        });
      }
      else {
        socket.emit('wrong user password', true);
        console.log('WRONG USER PASSWORD'); 
      }
    });
  });
});

//start listening
var port = process.env.PORT || 8000;
http.listen(port, function() {
  console.log("Listening to port 8000");
});
