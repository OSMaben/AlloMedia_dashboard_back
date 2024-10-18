const { check } = require("express-validator");
const handelParamesError = require("../../middleware/handelParamesError");
const UserModel = require("../../model/user.model");
const RestoModel = require("../../model/Resto.model");
const ValiditRestoId = [
  check("id").isMongoId().withMessage("Id is not fond"),
  handelParamesError,
];

const validiteUser = [
  check("name")
    .notEmpty()
    .withMessage("Name User is required")
    .isLength({ min: 3 })
    .withMessage("Too Short Name")
    .isLength({ max: 50 })
    .withMessage("Too long Name"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Forma not email")
    .custom(async (val) => {
      await UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in user"));
        }
      });
    }),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone(["ar-MA"])
    .withMessage("InValid phone number Moroco")
    .custom(async (val) => {
      await UserModel.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Phone already in user"));
        }
      });
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("Too Short Password"),
  handelParamesError,
];

const validiteResto = [
  check("restoname")
    .notEmpty()
    .withMessage("restoname Resto is required")
    .isLength({ min: 2 })
    .withMessage("Too Short restoname")
    .isLength({ max: 50 })
    .withMessage("Too long restoname")
    .custom(async (val) => {
      await RestoModel.findOne({ restoname: val }).then((name) => {
        if (name) {
          return Promise.reject(new Error("resto name already in Resto"));
        }
      });
    }),
  handelParamesError,
];

module.exports = {
  validiteUser,
  validiteResto,
  ValiditRestoId,
};
