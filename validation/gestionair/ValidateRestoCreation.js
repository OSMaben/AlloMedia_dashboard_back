const { check } = require("express-validator");
const handelParamesError = require("../../middleware/handelParamesError");
const RestoCreation = require("../../model/Resto.model");

const restoValidation = [
    // check('id').isMongoId().withMessage("This  Id Does Not Exist"),
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

    check('bio')
        .notEmpty()
        .withMessage("Bio is required")
        .isLength({ min: 10 })
        .isLength({ max: 50 }),

    check('type')
        .notEmpty()
        .withMessage("Type is required"),
    check('address')
        .notEmpty()
        .withMessage('Address is required'),

    handelParamesError,
]


module.exports = restoValidation;
