const mongoose = require('mongoose');
const { validate } = require('./user');

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                validator: function (v) {
                    if(!mongoose.Types.ObjectId.isValid(v)) {
                        throw new Error("Invalid ObjectId format!");
                    }
                },

            }
        ],
        messages: [messageSchema]
    }
);

module.exports = mongoose.model("Chat", chatSchema)