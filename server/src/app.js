const express = require('express');
const authRouter = require('./routes/auth.route.js');
// const userRouter = require('./routes/user.route.js');
const rideRouter = require('./routes/ride.route.js');
const vehicleRouter = require('./routes/vehicle.route.js');
const { authenticateUser } = require('./middlewares/auth.middleware.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRouter);
// app.use('/api/user', userRouter);
app.use('/api/ride', authenticateUser, rideRouter);
app.use('/api/vehicle', authenticateUser, vehicleRouter)

module.exports = app;