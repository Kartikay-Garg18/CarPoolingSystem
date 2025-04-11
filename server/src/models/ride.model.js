const mongoose = require('mongoose');

const Location = {
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
}

const rideSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    riders: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
        startLocation: {
            type: Location,
        },
        endLocation: {
            type: Location
        }
    }],
    startLocation: {
        type: Location
    },
    endLocation: {
        type: Location
    },
    route: [
        {
            type: Location
        },
    ],
    price: {
        type: Number,
        required: true,
    },
    departureTime: {
        type: Date,
        required: true,
    },
    seatsAvailable: {
        type: Number,
        required: true,
    },
    preferences: {
        smoking: { type: Boolean, default: false },
        pets: { type: Boolean, default: false },
        music: { type: Boolean, default: true },
        femaleOnly: { type: Boolean, default: false }
    },
    vehicleDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true,
    }
}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;