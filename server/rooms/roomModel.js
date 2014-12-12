'use strict';

var mongoose = require('mongoose');

//creates schema for messages with properties message, parentID, and childrenID
//unqiue _id created by default
var RoomSchema = new mongoose.Schema({
  name: String,
  users: { type : Array , "default" : [] },
  messages: { type : Array , "default" : [] },
  password: String,
  createdBy: String,
  sessionId: String
});

module.exports = mongoose.model('Room', RoomSchema);
