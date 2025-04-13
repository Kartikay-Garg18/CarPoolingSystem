const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB}`);
        // For running on local machine using MongoDB Compass
        // await mongoose.connect("mongodb://localhost:27017/Carpooling")
        console.log('MongoDB connected successfully !!');
    }
    catch(err){
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;