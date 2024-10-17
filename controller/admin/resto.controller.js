const User = require("../../model/user.model");
const HashPassword = require("../../util/HashPassword");
const slug = require("slug");
const envoyerEmail = require("../../util/mail");
const RestoModel = require("../../model/Resto.model");
const CreateToken = require("../../util/createToken");

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

module.exports = {
  createUserWithRestaurant,
};
