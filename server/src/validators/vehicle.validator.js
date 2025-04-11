const {z} = require('zod');

const vehicleSchema = z.object({
    vehicleType: z.enum(['Car', 'Bike', 'Bus', 'Truck'], {message: "Vehicle type must be car, bike, bus or truck"}),
    vehicleNumber: z.string().min(1, {message : "Vehicle number is required"}),
    seatsAvailable: z.number().min(1, {message : "Seats available must be greater than 0"}),
    driver: z.string().min(1, {message : "Driver id is required"}),
});

module.exports = {
    vehicleSchema
}