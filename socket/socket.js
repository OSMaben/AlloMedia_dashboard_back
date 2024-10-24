// socket.js
const socket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User with ID ${socket.id} connected`);

    const userRole = socket.handshake.query.role;

    if (userRole === "admin") {
      socket.join("adminRoom");
      console.log(`Admin with ID ${socket.id} joined the adminRoom`);
    }

    socket.on("disconnect", () => {
      console.log(`User with ID ${socket.id} disconnected`);
    });
  });
};

module.exports = socket;
