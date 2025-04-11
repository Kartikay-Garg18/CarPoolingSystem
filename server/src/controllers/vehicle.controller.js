const Vehicle = require('../models/vehicle.model.js');
const { vehicleSchema } = require('../validators/vehicle.validator.js');

const createVehicle = async (req, res) => {
    try {
        const { vehicleType, vehicleNumber, seatsAvailable } = req.body;
        
        const driver = req.user._id;

        const validate = vehicleSchema.safeParse({ vehicleType, vehicleNumber, seatsAvailable, driver });

        if (!validate.success) {
            return res.status(400).json({ error: validate.error.errors });
        }


        const vehicle = new Vehicle({
            vehicleType,
            vehicleNumber,
            seatsAvailable,
            driver
        });

        await vehicle.save();

        res.status(201).json({ message: 'Vehicle created successfully', vehicle });
    } catch (error) {
        res.status(500).json({ message: 'Creating vehicle server error', error: error.message });
    }
}

module.exports = {
    createVehicle,
};