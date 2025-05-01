const mongoose = require('mongoose');

const connectDB = async () => await mongoose.connect(`${process.env.DATABASE_URI}/devTinder`, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})

module.exports = connectDB;