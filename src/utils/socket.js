const socket = require('socket.io');
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
            const roomId = [userId, targetUserId].sort().join('_');

            console.log(firstName + ": joined room :", roomId);
            socket.join(roomId);

        });
        socket.on("sendMessage", (data) => {
            const { firstName, userId, targetUserId, message } = data;
            const roomId = [userId, targetUserId].sort().join('_');

            io.to(roomId).emit("receivedMessage", {
                firstName: firstName,
                message: message,
            });
        });
        socket.on("disconnect", () => { });


    })
}

module.exports = initializeSocket;