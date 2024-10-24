const jwt = require("jsonwebtoken");

const socket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User with ID ${socket.id} connected`);
  });
};

module.exports = socket;
