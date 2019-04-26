let jwt = require('jsonwebtoken');
let HttpStatus = require('http-status-codes');

function verifyToken(request, response, next)
{
    try
    {
        const token = request.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, process.env.JWT_KEY);
        request.email = decoded.email;
        next();
    }
    catch(error)
    {
        return response.status(HttpStatus.FORBIDDEN).json({
            message: error.message
        });
    }
    
}

exports.verifyToken = verifyToken;
