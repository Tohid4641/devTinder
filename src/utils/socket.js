const socket = require('socket.io');
const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected", socket.id);

        socket.on("joinChat", () => { });
        socket.on("sendMessage", () => { });
        socket.on("disconnect", () => { });


    })
}

module.exports = initializeSocket;