const express = require("express");
const {
  createUserWithRestaurant,
  deleteRestaurant,
  acceptedResto
} = require("../../controller/admin/resto.controller");
const {
  validiteResto,
  validiteUser,
  ValiditRestoId,
} = require("../../validation/admin/validetUserRestaurant");
const router = express.Router();

router.post(
  "/userWithResto",
  validiteUser,
  validiteResto,
  createUserWithRestaurant
);

router.delete("/resto/:id", ValiditRestoId ,deleteRestaurant);
router.get("/restaurants/:id/accept", ValiditRestoId, acceptedResto);

module.exports = router;
