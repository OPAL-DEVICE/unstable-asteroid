'use strict';

var mongoose = require('mongoose');

//creates schema for messages with properties message, parentID, and childrenID
//unqiue _id created by default
var LobbySchema = new mongoose.Schema({
  name: String,
  users: [String],
  messages: { type : Array , "default" : [] },
  password: String,
  createdBy: String
});

module.exports = mongoose.model('Lobby', LobbySchema);
