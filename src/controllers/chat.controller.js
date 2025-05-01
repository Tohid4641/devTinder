// const validators = require("../utils/validators");
const Chat = require("../models/chat");
const { successResponse } = require("../utils/responseHandler");
// const AppError = require("../utils/AppError");

const getChats = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const {targetUserId} = req?.params;

        let chats = await Chat.find({ participants: {$all:  [userId, targetUserId]} })
            .populate("participants", "firstName lastName photoUrl")
            .populate("messages.senderId", "firstName")
            

        if (!chats) {
            chats = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });

            await chats.save();
            successResponse(res, "New chats created!", 200, chats);
        }

        successResponse(res, "Chats found", 200, chats);

    } catch (error) {
        next(error);
    }
}

// const controller = async (req, res) => {
//     try {
        
//     } catch (error) {
//         next(error);
//     }
// }

module.exports = {
    getChats,
}