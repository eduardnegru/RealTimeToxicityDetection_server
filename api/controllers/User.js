'use strict';

let HttpStatus = require('http-status-codes');
let bCrypt = require('bcrypt-nodejs');
let jwt = require('jsonwebtoken');
let User = require("../classes/User");

async function signup(req, res)
{
	try
	{
		let httpBodyData = JSON.parse(Object.keys(req.body)[0]);
		let salt = bCrypt.genSaltSync(10);
		let hashedPassword = bCrypt.hashSync(httpBodyData.password , salt);
		let userInstance = new User();

		let objUser = await userInstance.create({
			"user_email": httpBodyData.email,
			"user_password_encrypted": hashedPassword,
			"user_first_name": httpBodyData.firstname,
			"user_last_name": httpBodyData.lastname,
			"user_password_salt": salt
		});

		const jwtToken = jwt.sign(
			{
				email: objUser.user_email,
				id: objUser.user_id
			},
			process.env.JWT_KEY,
			{
				expiresIn: "1d"
			}
		);

		res.status(HttpStatus.CREATED).json({
			message: "Signup successful",
			user: objUser,
			token: jwtToken
		});
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
	try
	{
		let httpBodyData = JSON.parse(Object.keys(req.body)[0]);
		let userInstance = new User();
		let objUser = await userInstance.get(httpBodyData.email, true);
		let strPassword = httpBodyData.password;
				
		if (objUser.length == 0)
		{
		
			res.status(HttpStatus.UNAUTHORIZED).json({
				message: "Authentification failed. User not found"
			});
		
			return;
		}

		let hash = bCrypt.hashSync(objUser.user_password_encrypted, objUser.user_password_salt);
		let compareResult = bCrypt.compareSync(strPassword, objUser.user_password_encrypted);

		if(compareResult)
		{
			const jwtToken = jwt.sign(
				{
					email: objUser.user_email,
					id: objUser.user_id
				},
				process.env.JWT_KEY,
				{
					expiresIn: "1d"
				}
			);

			res.status(HttpStatus.OK).json({
				message: "Authentification successful",
				token: jwtToken
			});
		}
		else
		{
			res.status(HttpStatus.UNAUTHORIZED).json({
				message: "Authentification failed. Password incorrect."
			});
		}

	}
	catch(error)
	{
		console.log(error);
		res.status(HttpStatus.BAD_REQUEST);
		res.json({
			message: error.message
		});
	}

}


exports.signup = signup;
exports.login = login;
