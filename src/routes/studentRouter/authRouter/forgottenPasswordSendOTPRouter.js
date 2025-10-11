const express = require("express");

const {
  forgottenPasswordSendOTP,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const router = express.Router();

router.route("/forgotten-password/send-otp").post(forgottenPasswordSendOTP);
// check user id present in DB or not, is active and is verified must be true

module.exports = router;
