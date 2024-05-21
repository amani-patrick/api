const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
    const authHeader = req.header('Authorization'); // Retrieve the Authorization header
    if (!authHeader) return res.status(401).send('Access denied. No token provided.'); // Check if the header is present

    // Check if the Authorization header starts with "Bearer "
    if (!authHeader.startsWith('Bearer ')) return res.status(401).send('Access denied. Invalid token format.');

    // Extract the token part from the header
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.jwtPrivateKey); // Verify the token
        req.user = decoded; // Assign the decoded token to req.user
        next(); // Move to the next middleware or route handler
    } catch (ex) {
        res.status(400).send('Invalid token.'); // Handle invalid token
    }
};
