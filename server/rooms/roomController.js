'use strict';

var Room  = require('./roomModel'),
    Q        = require('q'),
    mongoose = require('mongoose');


//connects global mongoose variable to online MongoDB DB
mongoose.createConnection('mongodb://MongoLab-d:tsWFfWiQkrxfZhKZbNOBPVGp3culnVTNs5G7nyd1cbE-@ds050077.mongolab.com:50077/MongoLab-d');

/**
 * helper functions that reference and modify messages in DB
 */

 module.exports = {
  /**
  * create and store room object
  * @params [Function] callback to be called after successful retrieval
  */
  addNewRoom: function(roomObject, userObject, callback) { 
   var newRoom = {
      name: roomObject.name,
      users: [userObject.name],
      messages: [],
      password: '',
      createdBy: userObject.name
   };
    console.log("INSIDE ADDNEWROOM");
    //creates promises of query functions
    var createRoom = Q.nbind(Room.create, Room);
    var findRoom = Q.nbind(Room.find, Room);

    //check if room already exists
    findRoom({ name: newRoom.name})
      .then(function(foundRoom){
        if(foundRoom.length !== 0) {
          //creates and saves the room to the DB
          createRoom(newRoom)
          .then(function(createdRoom) {
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
  * enter room when given room name
  * @params [Function] callback to be called after successful retrieval
  */
  /**
  * room authentication
  * @params [Function] callback to be called after successful retrieval
  */
  /**
  * create and store room object. if password is null, public room
  * @params [Function] callback to be called after successful retrieval
  */
  //PUBLIC: User not prompted for password, so this will be expecting an empty string
  //PRIVATE: User prompted for password
  enterRoom: function(roomName, roomPassword, userObj, callback) {
    var findRoom = Q.nbind(Room.find, Room);
    findRoom({name: roomName})
      .then(function(foundRoom){
        if(foundRoom.length !== 0) {
          if(foundRoom[0].password === roomPassword){
            foundRoom[0].users.push(userObj.username)
            callback(true);
          }
          //wrong password
          else {
            callback(false);
          }
        }
        else {
          callback(false);
        }
      })
      .fail(function() {
        console.error('Inappropriate input');
      });
  },

  /**
  * adds people to room when join
  * @params [Function] callback to be called after successful retrieval
  */

  /**
  * Removes user from room
  * @params [Object] room object
            [String] user's username to be removed 
  */
  exitRoom: function(roomObj, userObj){
    var userIndex = roomObj.users.indexOf(userObj.name);
    roomObj.splice(userIndex, 1);
  } //,
  

 };