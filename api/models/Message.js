'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = new Schema({
	message_text: {
		type: String,
		default: null,
		maxlength: 2000
	},
	message_is_toxic: {
		type: Number,
		default: null
	},
	message_source: {
		type: String,
		required: true,
		default: null
	},
	message_created_timestamp: {
		type: Number,
		default: null
	},
	message_score: {
		type: Number,
		default: 0
	},
});

module.exports = mongoose.model('Message', MessageSchema);
