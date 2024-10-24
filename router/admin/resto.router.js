const express = require("express");
const {
  createUserWithRestaurant,
  deleteRestaurant,
  acceptedResto,
  refusedResto,
  getListrestaurants,
  getUnacceptedRestaurants,
  createResto,
  getListNotification,
  banneRestaurant,
} = require("../../controller/admin/resto.controller");
const {
  validiteResto,
  validiteUser,
  ValiditRestoId,
} = require("../../validation/admin/validetUserRestaurant");

const router = express.Router();

const createRestaurantRouter = (io) => {
  router.post(
    "/userWithResto",
    validiteUser,
    validiteResto,
    createUserWithRestaurant
  );

  router.delete("/resto/:id", ValiditRestoId, deleteRestaurant);

  router.get("/restaurants/:id/accept", ValiditRestoId, (req, res) => {
    acceptedResto(req, res, io);
  });

  router.get("/res", (req, res) => {
    createResto(req, res, io);
  });

  router.get("/restaurants/:id/refuse", ValiditRestoId, refusedResto);
  router.get("/restaurants/approved", getListrestaurants);
  router.get("/restaurants/pending", getUnacceptedRestaurants);
  router.get("/getListNotification", getListNotification);
  router.delete("/deleted/restaurants/:id", ValiditRestoId, deleteRestaurant);
  router.get(
    "/banneRestaurant/restaurants/:id",
    ValiditRestoId,
    banneRestaurant
  );

  return router;
};

module.exports = createRestaurantRouter;
