const User = require("../../../model/user.model");
const HashPassword = require("../../../util/HashPassword");
const slug = require("slug");
const envoyerEmail = require("../../../util/mail");

const createUserWithRestaurant = async (req, res) => {
  try {
    return res.status(200).json("yes");
  } catch (error) {}
};

module.exports = {
  createUserWithRestaurant,
};
