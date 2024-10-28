const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const dbConection = require("./config/database");
const app = express();
const adminMiddleware = require("./middleware/adminMiddleware");
const gestionMiddleware = require("./middleware/managerMiddleware");
const verifyToken = require("./middleware/VerifyToken");
const authRouter = require("./router/auth/auth.router");
const http = require("http");
const profileRouter = require("./router/profile.router");
const adminRouter = require("./router/admin/resto.router");
const gestionairRouter = require("./router/gestionair/RestoGestion.router");
const clientRouter = require("./router/client/search");
const socket = require("./socket/socket");
const cors = require("cors");
const createRestaurantRouter = require("./router/admin/resto.router");
const createRestoGestoiner = require("./router/gestionair/RestoGestionSocket.router");
const createRes = require("./router/admin/test.router");
// livreur
const LivreurRouter = require("./router/livreur/livreur");
const LivreurMiddleware = require("./middleware/livreurMiddleware");

dbConection();
dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth/", authRouter);

const server = http.createServer(app);

// Initialize Socket.io after server creation
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Initialize socket events
socket(io);

// Use the io object after initialization
app.use("/api/livreur", verifyToken, LivreurRouter(io));

app.use("/api/v1/client/", clientRouter);
app.use(
  "/api/v1/gestionair/",
  verifyToken,
  gestionMiddleware,
  gestionairRouter
);

app.use("/api/profile/", verifyToken, profileRouter);
app.use((err, req, res, next) => {
  return res.status(400).json({ err });
});

const restaurantRouter = createRestaurantRouter(io);
app.use("/api/v1/admin/", verifyToken, adminMiddleware, restaurantRouter);

const createRestoGestoinerSocket = createRestoGestoiner(io);
app.use(
  "/api/v1/gestionair/socket",
  verifyToken,
  gestionMiddleware,
  createRestoGestoinerSocket
);

const res = createRes(io);
app.use("/res", res);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});