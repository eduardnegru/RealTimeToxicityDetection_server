'use strict';

let auth = require('../controllers/Auth');
let user = require('../controllers/User');
let dashboard = require("../controllers/Dashboard");


module.exports = function(app) {

	app.route('/login')
	.post(user.login);

	app.route('/signup')
	.post(user.signup);

	// .get(auth.verifyToken, user.get)
	app.route('/training_data_statistics')
	// .get(auth.verifyToken, dashboard.training_data_statistics);
	.get(dashboard.training_data_statistics);

	app.route('/messages_get')
	// .get(auth.verifyToken, dashboard.training_data_statistics);
	.get(dashboard.messages_get);
 };
