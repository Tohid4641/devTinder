const socket = require('socket.io');
const crypto = require('node:crypto');
const Chat = require('../models/chat.js');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const mongoose = require('mongoose');
const onlineUsers = new Map();

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join('$')).digest("hex");
}

const updateUserStatus = async (userId, isOnline) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }

        await User.findByIdAndUpdate(
            userId,
            {
                isOnline,
                lastSeen: new Date()
            },
            { new: true }
        );
    } catch (error) {
        console.error('Error updating user status:', error);
    }
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        },
        pingTimeout: 60000, // 60 seconds timeout
        connectTimeout: 60000
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error'));

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return next(new Error('Authentication error'));
            socket.user = user;
            next();
        });
    });

    io.on("connection", (socket) => {

        const userId = socket.user._id.toString();

        console.log("User connected:", userId);

        (async () => {
            try {
                onlineUsers.set(userId, socket.id);
                await updateUserStatus(userId, true);
                console.log("User online status updated");
            } catch (error) {
                console.error("Failed to update user status:", error);
            }
        })();

        // Handle join chat
        socket.on("joinChat", (data) => {
            try {
                const { firstName, userId, targetUserId } = data;
                const roomId = getSecretRoomId(userId, targetUserId);
                socket.join(roomId);
                console.log(`${firstName} joined room: ${roomId}`);
            } catch (error) {
                console.error("Error in joinChat:", error);
            }
        });

        // Handle send message
        socket.on("sendMessage", async (data) => {
            try {
                const { firstName, userId, targetUserId, message } = data;
                const roomId = getSecretRoomId(userId, targetUserId);

                const chat = await Chat.findOneAndUpdate(
                    { participants: { $all: [userId, targetUserId] } },
                    {
                        $push: {
                            messages: {
                                senderId: userId,
                                message: message
                            }
                        }
                    },
                    { upsert: true, new: true }
                );

                io.to(roomId).emit("receivedMessage", {
                    firstName,
                    userId,
                    message,
                });
            } catch (error) {
                console.error("Error in sendMessage:", error);
                socket.emit("messageError", { error: "Failed to send message" });
            }
        });

        // Handle disconnect
        socket.on("disconnect", async () => {
            try {
                onlineUsers.delete(userId);
                await updateUserStatus(userId, false);
                console.log("User disconnected:", userId);
            } catch (error) {
                console.error("Error in disconnect handler:", error);
            }
        });

    });

    // Handle server-side errors
    io.on("error", (error) => {
        console.error("Socket.IO error:", error);
    });

    return io;
};

module.exports = initializeSocket;