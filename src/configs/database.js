const mongoose = require('mongoose');

const connectDB = async () => await mongoose.connect(`mongodb+srv://devtauhid:V7DdpLNW8M8hJyTm@cluster0.dorpa.mongodb.net/devTinder`)

module.exports = connectDB;