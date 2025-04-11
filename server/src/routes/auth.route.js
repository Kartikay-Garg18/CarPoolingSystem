const {Router} = require('express');
const { registerUser, loginUser, getCurrentUser } = require('../controllers/auth.controller.js');
const { authenticateUser } = require('../middlewares/auth.middleware.js');
const router = Router();

// Route for user registration
router.route('/register').post(registerUser);

// Route for user login
router.route('/login').post(loginUser);

// Route for getting current user information
router.route('/profile').get(authenticateUser, getCurrentUser);

module.exports = router;