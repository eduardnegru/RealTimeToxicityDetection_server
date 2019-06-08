"use strict";

const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const routes = require('./api/routes/route');
const dashboard = require('./api/controllers/Dashboard');
const mongoose = require('mongoose');
const userModel = require('./api/models/User');
const messageModel = require('./api/models/Message');

let path = require('path');
global.appRoot = path.resolve(__dirname);

mongoose.connect('mongodb://127.0.0.1/toxic_filtering');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Authorization, *");
	res.header("Access-Control-Allow-Credentials", 'true');
	next();
});

routes(app);

var server = app.listen(port);
exports.server = server;
