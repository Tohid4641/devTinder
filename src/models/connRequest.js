const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const connRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} status value is not allowed!"
        }
    }
}, { timestamps: true }
);

connRequestSchema.pre('save', function (next) {
    const connRequest = this;

    if (connRequest.fromUserId.equals(connRequest.toUserId)) throw new AppError("You cannot connect with yourself!", 400);

    next();
})

module.exports = mongoose.model('ConnectionRequests', connRequestSchema);