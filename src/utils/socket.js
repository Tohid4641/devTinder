const socket = require('socket.io');
const crypto = require('node:crypto');
const Chat = require('../models/chat.js');

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join('$')).digest("hex");
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {

        socket.on("joinChat", (data) => {
            const { firstName, userId, targetUserId } = data;
            const roomId = getSecretRoomId(userId, targetUserId)

            console.log(firstName + ": joined room :", roomId);
            socket.join(roomId);

        });
        socket.on("sendMessage", async (data) => {
            const { firstName, userId, targetUserId, message } = data;
            try {
                const roomId = getSecretRoomId(userId, targetUserId)

                // save chat on DB
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }

                chat.messages.push({
                    senderId: userId,
                    message: message
                });
                await chat.save()

                io.to(roomId).emit("receivedMessage", {
                    firstName: firstName,
                    userId,
                    targetUserId,
                    message: message,
                });
            } catch (error) {
                console.error(error.message)
            }

        });
        socket.on("disconnect", () => { });


    })
}

module.exports = initializeSocket;