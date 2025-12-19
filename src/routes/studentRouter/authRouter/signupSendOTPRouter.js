const express = require("express");

const {
  signUpSendOTP,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const {
  validateStudentSignupSendOTPPostReqBody,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router
  .route("/signup/send-otp")
  .post(validateStudentSignupSendOTPPostReqBody, signUpSendOTP);

module.exports = router;
