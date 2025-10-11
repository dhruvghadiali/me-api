const express = require("express");

const {
  signUpOTPVerification,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const router = express.Router();

router.route("/signup/otp-verification").post(signUpOTPVerification);
// check user id present in DB or not, is active and is verified must be false, verification_token token must be string, email and phone otp 6 digit

module.exports = router;
