const express = require("express");

const {
  forgottenPasswordOTPVerification,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const router = express.Router();

router
  .route("/forgotten-password/otp-verification")
  .post(forgottenPasswordOTPVerification);
// check user id present in DB or not, is active and is verified must be true, verification_token token must be string, email and phone otp 6 digit

module.exports = router;
