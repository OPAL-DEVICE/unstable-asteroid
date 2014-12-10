'use strict';

var Message  = require('./userModel'),
    Q        = require('q'),
    mongoose = require('mongoose');

//connects global mongoose variable to online MongoDB DB
mongoose.connect('mongodb://MongoLab-d:tsWFfWiQkrxfZhKZbNOBPVGp3culnVTNs5G7nyd1cbE-@ds050077.mongolab.com:50077/MongoLab-d');

/**
 * helper functions that reference and modify messages in DB
 */

 module.exports = {
  /**
  * create and store user obj
  * @params [Function] callback to be called after successful retrieval
  */
  addNewUser: function(userObject, callback) { 
   var newUser = {
      name: userObject.name,
      password: userObject.password
   };
    
    //creates promises of query functions
    var createUser = Q.nbind(User.create, User);

    //creates and saves the lobby to the DB
    createUser(newUser)
    .then(function(createdUser) {
      return createdUser;
    }); 

  } //,

  

 };