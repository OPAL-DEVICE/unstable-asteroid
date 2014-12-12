'use strict';

var User  = require('./userModel'),
    Q        = require('q'),
    mongoose = require('mongoose');

//connects global mongoose variable to online MongoDB DB
mongoose.connect('mongodb://MongoLab-d:tsWFfWiQkrxfZhKZbNOBPVGp3culnVTNs5G7nyd1cbE-@ds050077.mongolab.com:50077/MongoLab-d');

/**
 * helper functions that reference and modify messages in DB
 */

 module.exports = {
  /**
  * create and store user object
  * @params [Object] user object to imitate user data to be stored
            [Function] callback to be called after successful retrieval
  */
  addNewUser: function(userObject, callback) { 
   var newUser = {
      name: userObject.name,
      password: userObject.password
   };

  var createUser = Q.nbind(User.create, User);
  var findUser = Q.nbind(User.find, User);

  //check for username duplication
  findUser({ name: newUser.name })
    .then(function(foundUser){
      if(foundUser.length === 0) {
        createUser(newUser)
          .then(function(createdUser) {
            callback(false);
            return createdUser;
          });
      }
      //Notify username taken
      else {
        callback(true);
      }
    })
    .fail(function() {
      console.error('Inappropriate Input')
    });
  },
  /**
  * create and store user object
  * @params [Object] user object to retrieve user's name
            [Function] callback to be called after successful retrieval
  */
  login: function(userObject, callback) {
    var findUser = Q.nbind(User.find, User);
    findUser({name: userObject.name})
    .then(function(foundUser){
      if(foundUser.length !== 0) {
        if(foundUser[0].password === userObject.password){
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
  } //,

  

 };