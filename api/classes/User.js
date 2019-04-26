let mysql = require('promise-mysql');

class User
{
	constructor()
	{

	}
	/**
	 * Insert a user in db
	 * @param {*} objUser
	 */
	async create(objUser)
	{
		let connection = await mysql.createConnection({
			host     : '127.0.0.1',
			user     : 'root',
			password : 'adrian',
			database : 'text_analytics'
		});

		let result = await connection.query("\
				SELECT \
					* \
				FROM `users` \
				WHERE \
					`user_email` = " + this.quote(objUser.user_email)
		);

		if(result.length !== 0)
		{
			throw new Error("User " + objUser.user_email + " already exists");
		}

		result = await connection.query("\
				INSERT INTO users \
					(\
						user_first_name,\
						user_last_name,\
						user_email,\
						user_password_encrypted,\
						user_password_salt\
					) \
					VALUES (" + 
						this.quote(objUser.user_first_name) + ", " +  
						this.quote(objUser.user_last_name) + "," + 
						this.quote(objUser.user_email) + "," + 
						this.quote(objUser.user_password_encrypted) + "," +
						this.quote(objUser.user_password_salt) + ")"
		);
			
		objUser.user_id = result.insertId;
		return this.toAPI(objUser);
	}

	quote(strText)
	{
		return "\"" + strText + "\"";
	}

	async get(strEmail, bIncludeSecrets=false)
	{
		let connection = await mysql.createConnection({
			host     : '127.0.0.1',
			user     : 'root',
			password : 'adrian',
			database : 'text_analytics'
		});

		let result = await connection.query("\
				SELECT \
					* \
				FROM `users` \
				WHERE \
					`user_email` = " + this.quote(strEmail)
		);

		return result.length == 0 ? [] : bIncludeSecrets ? result[0] : this.toAPI(result[0]);
	}

	toAPI(user)
	{
		return {
			"user_id": user.user_id,
			"user_first_name": user.user_first_name,
			"user_last_name": user.user_last_name,
			"user_email": user.user_email			
		};
	}
}

module.exports = User;
