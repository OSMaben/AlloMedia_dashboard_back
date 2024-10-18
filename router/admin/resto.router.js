const express = require("express");
const {
  createUserWithRestaurant,
  deleteRestaurant,
  acceptedResto,
  refusedResto,
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

router.delete("/resto/:id", ValiditRestoId, deleteRestaurant);
router.get("/restaurants/:id/accept", ValiditRestoId, acceptedResto);
router.get("/restaurants/:id/refuse", ValiditRestoId, refusedResto);

module.exports = router;
