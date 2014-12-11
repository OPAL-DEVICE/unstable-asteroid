'use strict';

var User  = require('./userModel'),
    Room  = require('../rooms/roomModel'),
    Q        = require('q'),
    mongoose = require('mongoose');

//connects global mongoose variable to online MongoDB DB
mongoose.createConnection('mongodb://MongoLab-d:tsWFfWiQkrxfZhKZbNOBPVGp3culnVTNs5G7nyd1cbE-@ds050077.mongolab.com:50077/MongoLab-d');

/**
 * helper functions that reference and modify messages in DB
 */

 module.exports = {
  /**
  * create and store user obj
  * TODO: Return all rooms to client
  * @params [Function] callback to be called after successful retrieval
  */
  addNewUser: function(userObject, callback) { 
   var newUser = {
      name: userObject.name,
      password: userObject.password
   };
   console.log(newUser);
    
    //creates promises of query functions
    var createUser = Q.nbind(User.create, User);
    var findUser = Q.nbind(User.find, User);
    var findRooms = Q.nbind(Room.find, Room);

    //check for username duplication
    findUser({ name: newUser.name })
      .then(function(foundUser){
        if(foundUser.length === 0) {
          createUser(newUser)
            .then(function(createdUser) {
              //if user successfully created, send back rooms
              findRooms({})
                .then(function(rooms){
                  callback(createdUser, rooms);
                  return createdUser;
                })
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
  * return user obj if username and password match
  * @params [Function] callback to be called after successful retrieval
  */
  login: function(userName, userPassword, callback) {
    var findUser = Q.nbind(User.find, User);
    var findRooms = Q.nbind(Room.find, Room);

    findUser({name: userName})
      .then(function(foundUser){
        if(foundUser.length !== 0) {
          if(foundUser[0].password === userPassword){
            findRooms({})
              .then(function(rooms) {
                callback(true, rooms);
              });
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