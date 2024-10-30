// socket/clientSocket.js
const orderStatusSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User with ID ${socket.id} connected for order status`);

        // Join an order room
        socket.on("joinOrderRoom", (orderId) => {
            socket.join(orderId);
            console.log(`User with ID ${socket.id} joined order room: ${orderId}`);
        });

        // Example of handling order status update
        socket.on("orderStatusUpdate", (data) => {
            io.to(data.orderId).emit("orderStatusUpdated", {
                orderId: data.orderId,
                status: data.status,
            });
        });

        socket.on("disconnect", () => {
            console.log(`User with ID ${socket.id} disconnected`);
        });
    });
};

module.exports = { orderStatusSocket };
