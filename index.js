const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const dbConection = require("./config/database");
const app = express();
const adminMiddleware = require("./middleware/adminMiddleware");
const gestionMiddleware = require("./middleware/managerMiddleware");
const verifyToken = require("./middleware/VerifyToken");
const authRouter = require("./router/auth/auth.router");

const profileRouter = require("./router/profile.router");
const adminRouter = require("./router/admin/resto.router");
const gestionairRouter = require("./router/gestionair/RestoGestion.router");


const cors = require("cors");
dbConection();
dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth/", authRouter);
app.use("/api/v1/admin/", verifyToken, adminMiddleware, adminRouter);
  app.use("/api/v1/gestionair/", verifyToken, gestionMiddleware, gestionairRouter);


app.use("/api/profile/", profileRouter);
app.use((err, req, res, next) => {
  return res.status(400).json({ err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;
