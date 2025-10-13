const express = require("express");

const {
  signUpOTPVerification,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const {
  validateStudentOTPVerificationPostReqBody,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router
  .route("/signup/otp-verification")
  .post(validateStudentOTPVerificationPostReqBody, signUpOTPVerification);

module.exports = router;
