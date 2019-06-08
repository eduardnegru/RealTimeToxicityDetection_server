let mongoose = require('mongoose');

class User
{
	constructor()
	{
		this.UserModel = mongoose.model('User');
	}

	/**
	 * Insert a user in db
	 * @param {*} objUser
	 * @throws Error
	 */
	async create(objUser)
	{
		let objUserDb = await this.get(objUser.email);

		if(objUserDb === null)
		{
			var model = await this.UserModel(objUser);
			return this.toAPI(await model.save());
		}
		else
		{
			throw new Error("User is already in the database.");
		}

	}


	/**
	 * Returns the object associated with the email.
	 * If the user is not found return null.
	 * @param {String} strUserEmail
	 * @throws Exception
	 */
	async get(strUserEmail)
	{
		try
		{
			return await this.UserModel.findOne( {
				"email": strUserEmail
			});
		}
		catch(error)
		{
			throw new Error(error.message);
		}
	}

	/**
	 * Returns the whitelisted fileds for the User model.
	 * @param {Object} user
	 */
	toAPI(objUser)
	{
		return {
			"id": objUser._id,
			"user_first_name": objUser.firstname,
			"user_last_name": objUser.lastname,
			"user_email": objUser.email
		};
	}
}

exports.User = User;
