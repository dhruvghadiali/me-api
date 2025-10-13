const express = require("express");

const {
  forgottenPasswordSendOTP,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const {
  validateStudentForgottenPasswordSendOTPPostReqBody,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router
  .route("/forgotten-password/send-otp")
  .post(
    validateStudentForgottenPasswordSendOTPPostReqBody,
    forgottenPasswordSendOTP
  );

module.exports = router;
