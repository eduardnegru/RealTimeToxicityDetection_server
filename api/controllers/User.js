'use strict';

let mongoose = require('mongoose');
let HttpStatus = require('http-status-codes');
let bCrypt = require('bcrypt-nodejs');
let jwt = require('jsonwebtoken');
let crypto = require("crypto");
let userClass = require("../classes/User");

exports.signup = signup;
exports.login = login;
exports.get = get;

async function signup(req, res)
{
	try
	{

		let httpBodyData = req.body;
		let salt = bCrypt.genSaltSync(10);
		let hashedPassword = bCrypt.hashSync(httpBodyData.password , salt);

		httpBodyData.password_encrypted = hashedPassword;
		httpBodyData.password_salt = salt;

		let objUser = new userClass.User();

		let user = await objUser.create(httpBodyData);
		const jwtToken = jwt.sign(
			{
				email: user.email,
				id: user._id
			},
			process.env.JWT_KEY,
			{
				expiresIn: "1d"
			}
		);

		res.cookie("jwt", jwtToken);
		res.status(HttpStatus.CREATED).send(user);
	}
	catch(error)
	{
		res.status(HttpStatus.INTERNAL_SERVER_ERROR);
		res.json({
			message : error.message
		});
	}

}

async function login(req, res)
{
	let UserModel = mongoose.model('User');
	let user = await UserModel.findOne({email: req.body.email});

	if (user === null)
	{
		res.status(HttpStatus.BAD_REQUEST);
		res.json({
			message: "User not found"
		});
		return;
	}

	let hash = bCrypt.hashSync(user.password, user.password_salt);
	let compareResult = bCrypt.compareSync(req.body.password, hash);

	if(compareResult)
	{
		const jwtToken = jwt.sign(
			{
				email: user.email,
				id: user._id
			},
			process.env.JWT_KEY,
			{
				expiresIn: "1d"
			}
		);

		res.cookie("jwt", jwtToken);
		res.status(HttpStatus.OK).json({
			message: "Authentification successful",
		});
	}
	else
	{
		res.status(HttpStatus.UNAUTHORIZED);
		res.json({
			message: "Authentication failed"
		});
	}
}

async function get(req, res)
{
	try
	{
		let objUser = new userClass.User();
 		let users = await objUser.get(JSON.parse(req.body.emails));
		res.status(HttpStatus.OK);
		res.json(users);
	}
	catch(error)
	{
		res.status(HttpStatus.BAD_REQUEST);
		res.json({
			message: error.message
		});
	}

}
