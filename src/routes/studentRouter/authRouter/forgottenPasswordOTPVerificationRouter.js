const express = require("express");

const {
  forgottenPasswordOTPVerification,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const {
  validateStudentOTPVerificationPostReqBody,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router
  .route("/forgotten-password/otp-verification")
  .post(
    validateStudentOTPVerificationPostReqBody,
    forgottenPasswordOTPVerification
  );

module.exports = router;
