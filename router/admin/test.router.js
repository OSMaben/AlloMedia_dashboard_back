const express = require("express");
const { createResto } = require("../../controller/admin/resto.controller");

const router = express.Router();

const createRes = (io) => {
  router.post("/", (req, res) => {
    createResto(req, res, io);
  });

  return router;
};

module.exports = createRes;
