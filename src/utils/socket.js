const socket = require('socket.io');
const crypto = require('node:crypto');
const Chat = require('../models/chat.js');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const onlineUsers = new Map(); // Store online users

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join('$')).digest("hex");
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token; // Get the token from the handshake
        if (!token) return next(new Error('Authentication error'));

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return next(new Error('Authentication error'));
            socket.user = user;
            next();
        });
    });


    io.on("connection", async (socket) => {
        console.log("user connected", socket.user);

        onlineUsers.set(socket.user._id, socket.id);
        await User.findByIdAndUpdate(socket.user._id, { isOnline: true });

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
                    message: message,
                });
            } catch (error) {
                console.error(error.message)
            }

        });
        socket.on("disconnect", async() => {
            console.log("user disconnected", socket.id);
            await User.findByIdAndUpdate(socket.user._id, { isOnline: false });
        });


    })
}

module.exports = initializeSocket;