let jwt = require('jsonwebtoken');
let HttpStatus = require('http-status-codes');

function verifyToken(request, response, next)
{

	try
	{
		if(request.headers.authorization)
		{
			console.log("Herer");
			const token = request.headers.authorization.split(" ")[1];
			console.log(token);
			let decoded = jwt.verify(token, process.env.JWT_KEY);
			request.email = decoded.email;
			next();
		}
		else
		{
			return response.status(HttpStatus.UNAUTHORIZED).json({
				message: "Unauthorized to use the api."
			});
		}

	}
	catch(error)
	{
		console.log(error);
		return response.status(HttpStatus.UNAUTHORIZED).json({
			message: "Unauthorized to use the api."
		});
	}
}

exports.verifyToken = verifyToken;
