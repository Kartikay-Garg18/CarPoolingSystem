const {Router} = require('express');
const { createRide, getAllRides, getRideById, joinRideRequest, acceptJoinRequest, rejectJoinRequest, getRequests, checkRequestStatus } = require('../controllers/ride.controller.js');

const router = Router();

// Route to create a new ride
router.route('/create').post(createRide);

// Route to get all rides
router.route('/').get(getAllRides);

//Route to join a ride
router.route('/join/:id').post(joinRideRequest)

//Route to accept join request
router.route('/accept/:id/:userId').patch(acceptJoinRequest)

//Route to reject join request
router.route('/reject/:id/:userId').patch(rejectJoinRequest)

//Route to get ride requests
router.route('/requests').get(getRequests)

//Route to check status of ride request
router.route('/status/:id').get(checkRequestStatus)

//Route to get ride by id
router.route('/:id').get(getRideById)
module.exports = router;