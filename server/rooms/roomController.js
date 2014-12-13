'use strict';

var Room  = require('./roomModel'),
    Q        = require('q'),
    mongoose = require('mongoose');


/**
 * helper functions that reference and modify messages in DB
 */

 module.exports = {
  /**
  * create and store room object
  * @params [Object] room object to imitate data to be stored
            [Object] user object to retrieve username
            [Function] callback to be called after successful retrieval
  */
  addNewRoom: function(roomObject, userObject, callback) { 
   var newRoom = {
      name: roomObject.name,
      users: [userObject.name],
      password: roomObject.password, 
      createdBy: userObject.name,
      sessionId: ''

   };

    var createRoom = Q.nbind(Room.create, Room);
    var findRoom = Q.nbind(Room.find, Room);
    console.log(JSON.stringify(findRoom()));

    //check if room already exists
    findRoom({ name: newRoom.name })
      .then(function(foundRoom){
        console.log(foundRoom.length);
        if(foundRoom.length === 0) {
          //creates and saves the room to the DB
          createRoom(newRoom)
            .then(function(createdRoom) {
              callback(false);
              return createdRoom;
          });
        }
        else {
          callback(true);
        }
      })
      .fail(function(){
        console.error('Inappropriate input');
      });

  },

  /**
  * enter room if roomName and roomPassword match with database
  * places user in room
  * @params [String] name of room
            [String] password of room
            [Object] user object to retrieve username to be placed in room
            [Function] callback to be called after successful retrieval
  */
  //PUBLIC: User not prompted for password, so this will be expecting an empty string
  //PRIVATE: User prompted for password
  enterRoom: function(roomName, roomPassword, userObj, callback) {
    var findRoom = Q.nbind(Room.find, Room);
    findRoom({name: roomName})
      .then(function(foundRoom){
        if(foundRoom.length !== 0) {
          if(foundRoom[0].password === roomPassword || foundRoom[0].password.length === 0){
            foundRoom[0].users.push(userObj.username);
            callback(true, foundRoom[0]);
          }
          //wrong password
          else {
            callback(false);
          }
        }
        else {
          //room name not found
          callback(false);
        }
      })
      .fail(function(err, data) {
        console.error('Inappropriate input', err);
      });
  }, 

  /**
  * Removes user from room
  * @params [Object] room object
            [String] user's username to be removed 
            [Function] callback to be called after successful retrieval
  */
  exitRoom: function(roomObj, userName, callback){
    var findRoom = Q.nbind(Room.findOne, Room);
    findRoom({_id: roomObj._id})
      .then(function(room){
        var userIndex = room.users.indexOf(userName);
        room.splice(userIndex, 1);
        callback(room);
      })
      .fail(function(err, data){
        console.error("Exit Room failed: ", err);
      });

  },
  /**
  * Returns array of all rooms
  * @params [Function] callback to be called after successful retrieval
  */
  getAllRooms: function(callback){
    var findRooms = Q.nbind(Room.find, Room);
    findRooms({})
      .then(function(rooms){
        callback(rooms);
      })
      .fail(function(err, data){
        console.error("getAllRooms failed: ", err);
      });
  },
  /**
  * returns session id of room for video chat, empty string if none
  * @params [String]    roomName to be searched for
            [Function]  callback to be called after successful retrieval
  */
  getSessionId: function(roomName, callback){
    var findRoom = Q.nbind(Room.findOne, Room);
    findRoom({name: roomName})
      .then(function(room){
        callback(room.sessionId);
      })
      .fail(function(err, data){
        console.error("getSessionId failed: ", err);
      });
  },
  /**
  * returns session id of room for video chat, empty string if none
  * @params [String]    roomName to be searched for
            [String]    sessionId to be added
            [Function]  callback to be called after successful retrieval
  */
  addSession: function(roomName, sessionId, callback){
    var findRoom = Q.nbind(Room.findOne, Room);
    findRoom({name: roomName})
      .then(function(room){
        room.sessionId = sessionId;
        callback(true);
      })
      .fail(function(){
        callback(false);
      });
  }
 };