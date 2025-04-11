const {Router} = require('express');
const { createVehicle } = require('../controllers/vehicle.controller.js');

const router = Router();

router.route('/create').post(createVehicle);


module.exports = router;