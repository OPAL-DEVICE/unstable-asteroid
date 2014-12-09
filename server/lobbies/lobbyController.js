'use strict';

var Message  = require('./messageModel'),
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
  addNewLobby: function(lobbyObject, callback) {
    
  }

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

  

 };