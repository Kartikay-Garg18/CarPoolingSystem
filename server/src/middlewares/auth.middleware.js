const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = {
    authenticateUser,
};