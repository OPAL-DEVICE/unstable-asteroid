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
});
//to connect to S3 and store files
MessageSchema.plugin(crate, {
	storage: new S3({
	  key: 'AKIAIBVRIYIU773KH2NQ',
	  secret: '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',
	  bucket: 'opal-device',
	  acl: 'public-read', // defaults to public-read
      region: 'US_West', // defaults to us-standard
	  path: function(attachment) { // where the file is stored in the bucket - defaults to this function
	  	return '/' + path.basename(attachment.path);
	  }
	}),
	fields: {
	  file: {
	  	name: String,
	  	url: String //aws3 link
	  }
	}
});

module.exports = mongoose.model('Message', MessageSchema);
