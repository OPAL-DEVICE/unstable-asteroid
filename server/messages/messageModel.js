'use strict';

var mongoose = require('mongoose'),
	crate = require('mongoose-crate'),
	S3 = require('mongoose-crate-s3');

//creates schema for messages with properties message, parentID, and childrenID
//unqiue _id created by default
var MessageSchema = new mongoose.Schema({
  message: String,
  roomID: String,
  parentID: mongoose.Schema.Types.ObjectId,
  childrenID: [mongoose.Schema.Types.ObjectId],
  fileURL: String //aws3 link
});

module.exports = mongoose.model('Message', MessageSchema);
