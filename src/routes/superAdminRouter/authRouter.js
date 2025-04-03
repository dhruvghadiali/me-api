const express = require("express");

const {
  signIn,
  signUp,
  changePassword,
} = require("@MEControllers/superAdminAuthController/superAdminAuthController");

const router = express.Router();

router.route("/signin").post(signIn);
router.route("/signup").post(signUp);
router.route("/change-password").post(changePassword);

module.exports = router;
