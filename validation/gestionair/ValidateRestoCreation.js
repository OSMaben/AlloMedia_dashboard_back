const { check } = require("express-validator");
const handelParamesError = require("../../middleware/handelParamesError");
const RestoCreation = require("../../model/Resto.model");

const restoValidation = [
    check('id').isMongoId().withMessage("This  Id Does Not Exist"),
    check('restoname')
        .notEmpty()
        .withMessage("Restoname is required")
        .isLength({ max: 20 })
        .withMessage('Name Of Your Resto is to long')
        .custom(async (val) => {
            await RestoCreation.findOne({ restoname: val }).then((name) => {
                if (name) {
                    return Promise.reject(new Error("This Resto Already Exist"));
                }
            });
        }),
    // check('logo')
    //     .notEmpty()
    //     .withMessage("Logo is required"),
    // check('image_banner')
    //     .notEmpty()
    //     .withMessage("Image Banner is required"),
    check('bio')
        .notEmpty()
        .withMessage("Bio is required")
        .isLength({ min: 10 })
        .isLength({ max: 50 }),
    check('menu')
        .notEmpty()
        .withMessage("Menu is required")
        .isArray()
        .withMessage('Menu  Should Be an array'),
    check('menu.*.name')
        .notEmpty()
        .withMessage("Menu item name is required"),

    check('menu.*.price')
        .notEmpty()
        .withMessage("Menu item price is required")
        .isNumeric()
        .withMessage("Menu item price must be a number"),

    check('menu.*.image')
        .optional() //  Optional
        .isObject()
        .withMessage("Image must be an object"),
    // check('type')
    //     .isEmpty()
    //     .withMessage("Type is required"),
    check('Address')
        .isEmpty()
        .withMessage('Address is required'),
    // check('managerId')
    //     .isEmpty()
    //     .withMessage('ManagerId is required')
    //     .isMongoId().withMessage("This Manager Id is not Found"),
    handelParamesError,
]


module.exports = restoValidation;
