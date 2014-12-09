'use strict';

var mongoose = require('mongoose');

//creates schema for messages with properties message, parentID, and childrenID
//unqiue _id created by default
var LobbySchema = new mongoose.Schema({
  name: String,
  usersId: [mongoose.Schema.Types.ObjectId],
  messages: { type : Array , "default" : [] },
  password: String,
  createdBy: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('Lobby', LobbySchema);
