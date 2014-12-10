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
      usersId: [userObject.userId],
      messages: [],
      password: '',
      createdBy: [mongoose.Schema.Types.ObjectId]
   };
    
    //creates promises of query functions
    var createLobby = Q.nbind(Lobby.create, Lobby);

    //creates and saves the lobby to the DB
    createLobby(newLobby)
    .then(function(createdLobby) {
      return createdLobby;
    }); 

  } //,


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

  /**
  * adds people to lobby when join
  * @params [Function] callback to be called after successful retrieval
  */


  

 };