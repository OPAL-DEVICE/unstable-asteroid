'use strict';

var Message  = require('./lobbyModel'),
    Q        = require('q'),
    mongoose = require('mongoose');

//connects global mongoose variable to online MongoDB DB
mongoose.connect('mongodb://MongoLab-d:tsWFfWiQkrxfZhKZbNOBPVGp3culnVTNs5G7nyd1cbE-@ds050077.mongolab.com:50077/MongoLab-d');

/**
 * helper functions that reference and modify messages in DB
 */

 module.exports = {
  /**
  * create and store lobby object
  * @params [Function] callback to be called after successful retrieval
  */
  addNewLobby: function(lobbyObject, userObject, callback) { 
   var newLobby = {
      name: lobbyObject.name,
      users: [userObject.name],
      messages: [],
      password: '',
      createdBy: userObject.name
   };
    
    //creates promises of query functions
    var createLobby = Q.nbind(Lobby.create, Lobby);
    var findLobby = Q.nbind(Lobby.find, Lobby);

    //check if lobby already exists
    findLobby({ name: newLobby.name})
      .then(function(foundLobby){
        if(foundLobby.length !== 0) {
          //creates and saves the lobby to the DB
          createLobby(newLobby)
          .then(function(createdLobby) {
            return createdLobby;
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
  * enter lobby when given lobby name
  * @params [Function] callback to be called after successful retrieval
  */
  /**
  * lobby authentication
  * @params [Function] callback to be called after successful retrieval
  */
  /**
  * create and store lobby object. if password is null, public lobby
  * @params [Function] callback to be called after successful retrieval
  */
  //PUBLIC: User not prompted for password, so this will be expecting an empty string
  //PRIVATE: User prompted for password
  enterLobby: function(lobbyName, lobbyPassword, userObj, callback) {
    var findLobby = Q.nbind(Lobby.find, Lobby);
    findLobby({name: lobbyName})
      .then(function(foundLobby){
        if(foundLobby.length !== 0) {
          if(foundLobby[0].password === lobbyPassword){
            foundLobby[0].users.push(userObj.username)
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
  * adds people to lobby when join
  * @params [Function] callback to be called after successful retrieval
  */

  /**
  * Removes user from lobby
  * @params [Object] lobby object
            [String] user's username to be removed 
  */
  exitLobby: function(lobbyObj, userObj){
    var userIndex = lobbyObj.users.indexOf(userObj.name);
    lobbyObj.splice(userIndex, 1);
  } //,
  

 };