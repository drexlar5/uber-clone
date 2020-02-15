const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtsecret');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Missing Authorization Header' });
    }

    try {
        const token = authHeader;
        jwt.verify(token,  jwtSecret);
        next();
    } catch (error) {
        return res.status(401).json(error)
    }
}