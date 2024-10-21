const User = require("../../model/user.model");
const HashPassword = require("../../util/HashPassword");
const slug = require("slug");
const envoyerEmail = require("../../util/mail");
const RestoModel = require("../../model/Resto.model");
const CreateToken = require("../../util/createToken");
const UserModel = require("../../model/user.model");

const createUserWithRestaurant = async (req, res) => {
  try {
    const { name, email, password, restoname, phone } = req.body;

    const user = {
      name,
      email,
      password,
      phone,
    };

    user.role = "client";
    user.slug = slug(user.name);

    if (user.password) {
      user.password = await HashPassword(user.password);
    }

    const managerResto = await User.create(user);

    const resto = {
      restoname,
      managerId: managerResto._id,
      isAccepted: true,
    };

    const Resto = await RestoModel.create(resto);

    const token = CreateToken({ id: managerResto._id }, "5m");

    const confirmationLink =
      "http://localhost:8080/api/auth/verifyAcount/" + token;

    const data = {
      userName: managerResto.name,
      restaurantName: Resto.restoname,
      confirmationLink,
    };

    await envoyerEmail(
      user.email,
      "verfei accoute",
      confirmationLink,
      null,
      "VRA",
      data
    );

    return res.status(201).json({
      message: "User and restaurant created successfully",
      user: managerResto,
      restaurant: Resto,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while creating the user and restaurant",
      error: error.message || "Internal server error",
    });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const id = req.params.id;
    const resto = await RestoModel.findById(id);
    return res.status(201).json({
      restaurant: resto,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while creating the user and restaurant",
      error: error.message || "Internal server error",
    });
  }
};

const acceptedResto = async (req, res) => {
  try {
    const id = req.params.id;
    const resto = await RestoModel.findById(id);

    if (!resto) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    resto.isAccepted = true;
    await resto.save();

    const manager = await UserModel.findById(resto.managerId);

    if (!resto) {
      return res.status(404).json({
        message: "Manager not found",
      });
    }

    manager.role = "manager";
    await manager.save();

    return res.status(200).json({
      message: "Restaurant successfully accepted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while accepting the restaurant",
      error: error.message || "Internal server error",
    });
  }
};

const refusedResto = async (req, res) => {
  try {
    const id = req.params.id;
    const resto = await RestoModel.findById(id);

    if (!resto) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    await resto.deleteOne();

    return res.status(200).json({
      message: "Restaurant successfully refused",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while refusing the restaurant",
      error: error.message || "Internal server error",
    });
  }
};

const getListrestaurants = async (req, res) => {
  try {
    const restaurants = await RestoModel.find({ isAccepted: true });

    return res.status(200).json({
      restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getUnacceptedRestaurants = async (req, res) => {
  try {
    const restaurants = await RestoModel.find({ isAccepted: false });

    return res.status(200).json({
      restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createUserWithRestaurant,
  deleteRestaurant,
  acceptedResto,
  refusedResto,
  getListrestaurants,
  getUnacceptedRestaurants,
};
