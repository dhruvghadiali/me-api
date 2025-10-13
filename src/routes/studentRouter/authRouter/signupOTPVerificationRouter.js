const express = require("express");

const {
  signUpOTPVerification,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const {
  validateStudentOTPVerification,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router
  .route("/signup/otp-verification")
  .post(validateStudentOTPVerification, signUpOTPVerification);

module.exports = router;
