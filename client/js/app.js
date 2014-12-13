
treeData = [];
var room = null;
var setTreeData = function(data){
  //If data is present set equal to treedata 
  // then update page
  treeData = data ? data : treeData;
  update();
};

var setRoom = function(roomObj){
  console.log("IN SET ROOM");
  console.log(roomObj);
  room = roomObj;
};

var allowRemoval = function(data){
  $('.btn.remove').show();
};

var disallowRemoval = function(data){
  $('.btn.remove').hide();
};

$(document).ready(function(){


  $('.btn.remove').hide();

  //Make connection 
  var socket = new Socket();

  socket.redirectToRoom();

  //Set listener
  socket.onRedirectToRoom(setRoom);
  // console.log("ROOM: ");
  // console.log([room]);
  socket.onAllMessages(setTreeData);

  //Add bubble on submit
  $('.inputbox').on('submit', function(e){
    e.preventDefault();
    var message = $('.messageBox').val();
    $('.messageBox').val('');
    var messageObject = {};
    var parent;
    if(nodeSelected){
      parent = nodeSelected._id;
    }else{
      parent = null;
    }
    messageObject = {
      message: message,
      parentID: parent,
      roomID: room._id
    };
    socket.sendMessage(messageObject);
  });

  $('.btn.edit').on('click',function(e){
    //Emit message to db
    var message = $('.messageBox').val();
    $('.messageBox').val('');
    var messageObject = {};
    if(nodeSelected){
      //Send over message and parentID
      messageObject = {
        message: message,
        _id: nodeSelected._id,
        roomID: room._id
      };
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
