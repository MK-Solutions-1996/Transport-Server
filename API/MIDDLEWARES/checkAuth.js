const jwt = require('jsonwebtoken');


/*
    This middleware can be called before execute each of the endpoints.
    So if this function returns an error, it will not execute the endpoint.
*/
module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers.token, 'secret'); // check the token is available
        req.userData = decoded; // Decoded userData
        next(); // If successfully authenticate, then it will be continued.
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed'
        })
    }
}