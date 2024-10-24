const express = require("express");
const router = express.Router();
const {
  CreateResto,
} = require("../../controller/gestionair/gestionair.controller");
const restoValidation = require("../../validation/gestionair/ValidateRestoCreation");
const ManagerMiddleware = require("../../middleware/managerMiddleware");
const upload = require("../../util/upload");
const VerifyToken = require("../../middleware/VerifyToken");

//creation of the resto
const createResto = (io) => {
  router.post(
    "/createResto",
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "image_banner", maxCount: 1 },
    ]),
    restoValidation,
    (req, res) => {
      CreateResto(req, res, io);
    }
  );
  return router;
};

module.exports = createResto;
