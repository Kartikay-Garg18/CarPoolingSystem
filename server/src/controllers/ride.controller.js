const Ride = require('../models/ride.model.js');
const { route } = require('../routes/ride.route.js');
const { rideSchema } = require('../validations/ride.validation.js');

const createRide = async (req, res) => {
    try {

        const driver = req.user._id;

        const { startLocation, endLocation, route, price, departureTime, seatsAvailable, preferences, vehicleDetails } = req.body;

        const validate = rideSchema.safeParse({driver, startLocation, endLocation, route, price, departureTime, seatsAvailable, preferences, vehicleDetails});

        if (!validate.success) {
            return res.status(400).json({ error: validate.error.errors });
        }
    
        const ride = new Ride({
            driver,
            startLocation,
            endLocation,
            route: route || [],
            price,
            departureTime,
            seatsAvailable,
            preferences: preferences || {},
            riders: [],
            vehicleDetails
        });
    
        await ride.save();

        res.status(201).json({ message: 'Ride created successfully', 
            ride: await ride.populate('driver', 'name email phoneNumber gender').populate('riders.user') });
    } catch (error) {
        res.status(500).json({ error: 'Creating ride server error' });
    }
}

const getAllRides = async (req, res) => {
    try {
        const {startLocation, endLocation, departureTime, preferences} = req.query;

        const filter = {
            seatsAvailable: { $gt: 0 },
            departureTime: departureTime ? { $gte: new Date(departureTime) } : undefined,
            preferences: preferences ? JSON.parse(preferences) : undefined,
        }

        const availableRides = await Ride.find(filter).populate('User', 'name email phoneNumber gender').populate('Vehicle');

        const riderLocation = {
            startLocation: startLocation ? JSON.parse(startLocation) : undefined,
            endLocation: endLocation ? JSON.parse(endLocation) : undefined,
        }
        
        const ridesWithMatch = availableRides.filter(ride => {
            const driverLocation = {
                startLocation: ride.startLocation,
                endLocation: ride.endLocation
            }

            const matchPercentage = calculateMatchPercentage(riderLocation, driverLocation);
            
            return matchPercentage >= 0.5 ? {
                ...ride.toObject(),
                matchPercentage
            } : null;
        });

        ridesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.status(200).json({ rides: ridesWithMatch });
    }
    catch (error) {
        res.status(500).json({ error: 'Get all rides server error' });
    }
}

module.exports = {
    createRide,
    getAllRides
}