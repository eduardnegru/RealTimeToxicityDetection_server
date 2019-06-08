'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	firstname: {
		type: String,
		required: true,
		maxlength: 100,
		default: null
	},
	lastname: {
		type: String,
		required: true,
		maxlength: 100,
		default: null
	},
	password: {
		type: String,
		required: true,
		maxlength: 100,
	},
	password_salt: {
		type: String,
		default: null,
		maxlength: 300
	},
	email: {
		type: String,
		required: true,
		default: null
	},
	timestamp_created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', UserSchema);