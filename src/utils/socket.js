const socket = require('socket.io');
const crypto = require('node:crypto');

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
        console.log("New client connected", socket.id);

        socket.on("joinChat", (data) => {
            const { firstName, userId, targetUserId } = data;
            const roomId = getSecretRoomId(userId, targetUserId)

            console.log(firstName + ": joined room :", roomId);
            socket.join(roomId);

        });
        socket.on("sendMessage", (data) => {
            const { firstName, userId, targetUserId, message } = data;
            const roomId = getSecretRoomId(userId, targetUserId)

            io.to(roomId).emit("receivedMessage", {
                firstName: firstName,
                userId,
                targetUserId,
                message: message,
            });
        });
        socket.on("disconnect", () => { });


    })
}

module.exports = initializeSocket;