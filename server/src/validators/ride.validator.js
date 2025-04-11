const { z } = require('zod');


const locationSchema = z.object({
    latitude: z.number().min(-90).max(90, { message: "Latitude must be between -90 and 90" }),
    longitude: z.number().min(-180).max(180, { message: "Longitude must be between -180 and 180" }),
    address: z.string().min(1, { message: "Address is required" }),
});

const rideSchema = z.object({
    driver: z.string().nonempty({ message: "Driver ID is required" }),
    riders: z.array(z.object({
        user: z.string().nonempty({ message: "User ID is required" }),
        status: z.enum(['pending', 'accepted', 'rejected'], { message: "Status must be pending, accepted, or rejected" }).default('pending'),
        startLocation: locationSchema,
        endLocation: locationSchema,
    })).optional(),
    startLocation: locationSchema,
    endLocation: locationSchema,
    route: z.array(locationSchema).optional(),
    price: z.number().positive({ message: "Price must be a positive number" }),
    departureTime: z.date({ message: "Departure time is required" }),
    seatsAvailable: z.number().int().positive({ message: "Seats available must be a positive integer" }),
    preferences: z.object({
        smoking: z.boolean().default(false),
        pets: z.boolean().default(false),
        music: z.boolean().default(true),
        femaleOnly: z.boolean().default(false),
    }).optional(),
    vehicleDetails: z.string(),
});

module.exports = {
    rideSchema,
    locationSchema,
};