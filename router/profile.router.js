const express = require("express");
const upload = require("../util/upload");
const {
  uplodProfileImage,
  uplodBannerImage,
} = require("../controller/profile.controller");
const verifyToken = require("../middleware/VerifyToken");
const router = express.Router();

router.post(
  "/upload/imgproflile",
  verifyToken,
  upload.single("image"),
  uplodProfileImage
);

router.post(
  "/upload/banner",
  verifyToken,
  upload.single("image"),
  uplodBannerImage
);

module.exports = router;
