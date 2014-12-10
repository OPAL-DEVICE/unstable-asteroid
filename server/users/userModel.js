'use strict';

var mongoose = require('mongoose');

//creates schema for messages with properties message, parentID, and childrenID
//unqiue _id created by default
var UserSchema = new mongoose.Schema({
  name: String,
  password: String
});

module.exports = mongoose.model('User', UserSchema);
