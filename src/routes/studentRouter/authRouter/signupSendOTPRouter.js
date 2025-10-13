const express = require("express");

const {
  signUpSendOTP,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const {
  validateStudentSignUpSendOTP,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router
  .route("/signup/send-otp")
  .post(validateStudentSignUpSendOTP, signUpSendOTP);

module.exports = router;
