const Ride = require('../models/ride.model.js');
const { rideSchema, joinRideSchema } = require('../validators/ride.validator.js');
const Vehicle = require('../models/vehicle.model.js');
const { calculateMatchPercentage } = require('../utils/index.js');

const createRide = async (req, res) => {
    try {

        const driver = req.user._id;

        const { startLocation, endLocation, route, price, departureTime, seatsAvailable, preferences, vehicleDetails } = req.body;

        const validate = rideSchema.safeParse({driver, startLocation, endLocation, route, price, departureTime, seatsAvailable, preferences, vehicleDetails});

        if (!validate.success) {
            return res.status(400).json({ error: validate.error.errors });
        }

        const isVehicle = await Vehicle.findById({_id: vehicleDetails});

        if(!isVehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        if(isVehicle.seatsAvailable < seatsAvailable) {
            return res.status(400).json({ error: 'Not enough seats available in the vehicle' });
        }

        if(isVehicle.driver.toString() !== driver.toString()) {
            return res.status(404).json({ error: 'No vehicle found for this driver' });
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
            ride });
    } catch (error) {
        res.status(500).json({ message: 'Creating ride server error', error: error.message });
    }
}

const getAllRides = async (req, res) => {
    try {
        
        const {startLocation, endLocation, departureTime, preferences} = req.query;

        const filter = {
            seatsAvailable: { $gt: 0 },
            departureTime: departureTime ? { $gte: new Date(Number(departureTime)) } : { $gte: Date.now() },
            preferences: preferences ? JSON.parse(preferences) : {},
        }

        const availableRides = await Ride.find(filter).populate('driver', 'name email phoneNumber gender').populate('vehicleDetails');

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
            console.log(matchPercentage)

            return matchPercentage >= 0.5 ? {
                ...ride.toObject(),
                matchPercentage
            } : null;
        });

        ridesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.status(200).json({ rides: ridesWithMatch.length>0?ridesWithMatch : "No nearby rides are found" });
    }
    catch (error) {
        res.status(500).json({ message: 'Get all rides server error', error: error.message });
    }
}

const getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id).populate('driver', 'name email phoneNumber gender').populate('vehicleDetails');

        if(!ride){
            return res.status(400).json({ message: "No ride found" });
        }

        return res.status(200).json(ride);

    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch ride by id" });
    }
}

const joinRideRequest = async (req, res) => {
    try {
        const rideId = req.params.id;
        const user = req.user._id;

        const { startLocation, endLocation, seatsRequested } = req.body;

        const validate = joinRideSchema.safeParse({ user, startLocation, endLocation, seatsRequested });
        if (!validate.success) {
            return res.status(400).json({ error: validate.error.errors });
        }

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (ride.seatsAvailable < seatsRequested) {
            return res.status(400).json({ message: "Not enough seats available" });
        }

        if (ride.riders.some(rider => rider.user.toString() === user.toString())) {
            return res.status(400).json({ message: "You have already joined this ride" });
        }

        if(ride.driver.toString() === user.toString()) {
            return res.status(400).json({ message: "You cannot join your own ride" });
        }

        ride.riders.push({ user, startLocation, endLocation, seatsRequested });

        await ride.save();

        return res.status(200).json({ message: "Ride request sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to join ride request" });
    }
}

const acceptJoinRequest = async (req, res) => {
    try {
        const rideId = req.params.id;
        const userId = req.params.userId;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the driver can accept ride requests" });
        }

        const riderIndex = ride.riders.findIndex(rider => rider.user.toString() === userId.toString());
        if (riderIndex === -1) {
            return res.status(404).json({ message: "Rider not found" });
        }

        if (ride.riders[riderIndex].status !== 'pending') {
            return res.status(400).json({ message: "Ride request is already accepted or rejected" });
        }

        ride.riders[riderIndex].status = 'accepted';
        ride.seatsAvailable -= ride.riders[riderIndex].seatsRequested;

        await ride.save();

        return res.status(200).json({ message: "Ride request accepted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to accept join request" });
    }
}

const rejectJoinRequest = async (req, res) => {
    try {
        const rideId = req.params.id;
        const userId = req.params.userId;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the driver can reject ride requests" });
        }

        const riderIndex = ride.riders.findIndex(rider => rider.user.toString() === userId.toString());
        if (riderIndex === -1) {
            return res.status(404).json({ message: "Rider not found" });
        }

        if (ride.riders[riderIndex].status !== 'pending') {
            return res.status(400).json({ message: "Ride request is already accepted or rejected" });
        }
        
        ride.riders[riderIndex].status = 'rejected';

        await ride.save();

        return res.status(200).json({ message: "Ride request rejected successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to reject join request" });
    }
}

const getRequests = async(req, res) => {
    try {
        const driver = req.user._id;

        const rideRequests = await Ride.find({
            driver,
            $expr: { $gt: [{ $size: "$riders" }, 0] }
        }).populate('riders.user');

        if (!rideRequests || rideRequests.length === 0) {
            return res.status(404).json({ message: "No ride requests found" });
        }

        const requests = rideRequests.map(ride => {
            return {
                rideId: ride._id,
                startLocation: ride.startLocation,
                endLocation: ride.endLocation,
                route: ride.route,
                price: ride.price,
                departureTime: ride.departureTime,
                seatsAvailable: ride.seatsAvailable,
                riders: ride.riders.filter(rider => rider.status === 'pending').map(rider => ({
                    userId: rider.user._id,
                    userName: rider.user.name,
                    startLocation: rider.startLocation,
                    endLocation: rider.endLocation,
                    seatsRequested: rider.seatsRequested
                }))
            }
        });

        return res.status(200).json({ rideRequests: requests });

    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch ride requests" });
        
    }
}

const checkRequestStatus = async (req, res) => {
    try {
        const rideId = req.params.id;
        const userId = req.user._id;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if(ride.driver.toString() === userId.toString()) {
            return res.status(400).json({ message: "You are the driver of this ride" });
        }

        const rider = ride.riders.find(rider => rider.user.toString() === userId.toString());
        if (!rider) {
            return res.status(404).json({ message: "You have not joined this ride" });
        }

        return res.status(200).json({ status: rider.status });
    } catch (error) {
        return res.status(500).json({ message: "Failed to check status" });
    }
}

module.exports = {
    createRide,
    getAllRides,
    getRideById,
    joinRideRequest,
    acceptJoinRequest,
    rejectJoinRequest,
    getRequests,
    checkRequestStatus
}