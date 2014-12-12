
treeData = [];

var setTreeData = function(data){
  //If data is present set equal to treedata 
  // then update page
  treeData = data ? data : treeData;
  update();
};

var allowRemoval = function(data){
  $('.btn.remove').show();
}

var disallowRemoval = function(data){
  $('.btn.remove').hide();
}

$(document).ready(function(){


  $('.btn.remove').hide();

  //Make connection 
  var socket = new Socket();

  //Set listener
  socket.onAllMessages(setTreeData);
  socket.onEnteredRoom(startVidSession);

  // var startVidSession = function(sessionId, token) {
  //   console.log(sessionId, token);
  //   // Initialize API key, session, and token...
  //   // Think of a session as a room, and a token as the key to get in to the room
  //   // Sessions and tokens are generated on your server and passed down to the client
  //   var apiKey = "45105222";
  //   var sessionId = sessionId;
  //   var token = token;

  //   var session = OT.initSession(sessionId);
  //   var publisher = OT.initPublisher(apiKey, 'publisher');

  //   session.on({
  //     // when session.connect() asynchronously completes
  //     sessionConnected: function(event) {
  //       console.log('hi');
  //       // Publish the publisher: triggers 'streamCreated' on other clients
  //       session.publish(publisher);
  //     },

  //     // runs when another client publishes a stream: when session.publish() is called
  //     streamCreated: function(event) {
  //       // Create a container for a new Subscriber, assign it an id using the streamId, put it inside
  //       // the element with id="subscribers"
  //       var subContainer = document.createElement('div');
  //       subContainer.id = 'stream id: ' + event.stream.streamId;
  //       console.log(subContainer.id);
  //       document.getElementById('subscribers').appendChild(subContainer);

  //       // Subscribe to the stream that caused this event, put it inside the container we just made
  //       session.subscribe(event.stream, subContainer);
  //     }
  //   });
  //   // Connect to the Session using the 'apiKey' of the application and a 'token' for permission
  //   session.connect(apiKey, token);
  // };


  //Add bubble on submit
  $('.inputbox').on('submit', function(e){
    e.preventDefault();
    var message = $('.messageBox').val();
    $('.messageBox').val('');
    var messageObject = {};
    if(nodeSelected){
      //Send over message and parentID
      messageObject = {message: message, parentID: nodeSelected._id};
    }else{
      messageObject = {message: message, parentID: 'null'};
    }
    socket.sendMessage(messageObject);
  });

  $('.btn.edit').on('click',function(e){
    //Emit message to db
    var message = $('.messageBox').val();
    $('.messageBox').val('');
    var messageObject = {};
    if(nodeSelected){
      //Send over message and parentID
      messageObject = {message: message, _id: nodeSelected._id};
      socket.sendEdit(messageObject);
    }
  });

  

  $('.btn.remove').on('click',function(e){
    //Emit message to db
    var messageObject = {};
      //Send over id and and parentID
      messageObject = {_id: nodeSelected._id, parentID: nodeSelected.parentID};
      socket.sendDelete(messageObject);
    $(this).hide();
  });

});
