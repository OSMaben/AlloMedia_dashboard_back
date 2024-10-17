const express = require("express");
const {
  createUserWithRestaurant,
} = require("../../controller/auth/admin/resto.controller");
const {
  validiteResto,
  validiteUser,
} = require("../../validation/admin/validetUserRestaurant");
const router = express.Router();

router.post(
  "/userWithResto",
  validiteUser,
  validiteResto,
  createUserWithRestaurant
);

module.exports = router;
