const express = require("express");

const {
  signUpSendOTP,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const router = express.Router();

router.route("/signup/send-otp").post(signUpSendOTP);
// check user id present in DB or not, is active and is verified must be false

module.exports = router;
