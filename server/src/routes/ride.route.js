const {Router} = require('express');
const { createRide, getAllRides } = require('../controllers/ride.controller.js');

const router = Router();

// Route to create a new ride
router.route('/create').post(createRide);

// Route to get all rides
router.route('/').get(getAllRides);

module.exports = router;