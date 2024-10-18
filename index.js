const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./config/database");
const app = express();
const authRouter = require("./router/auth/auth.router");
const cors = require("cors");
const http = require('http'); 
const socketIo = require('socket.io');

dotenv.config();
dbConnection();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth/", authRouter);

app.use((err, req, res, next) => {
  return res.status(400).json({ err });
});


const server = http.createServer(app);

const io = socketIo(server);


io.on('connection', (socket) => {
  console.log('User est connecté : ' + socket.id);

 
  socket.on('newOrder', (orderId) => {
    console.log('Nouvelle commande prête pour la livraison : ' + orderId);

    io.emit('orderReady', { message: 'Nouvelle commande prête', orderId });
  });

  socket.on('disconnect', () => {
    console.log('Livreur déconnecté : ' + socket.id);
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = { app, io }; 
