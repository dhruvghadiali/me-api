const express = require("express");

const {
  signin,
  signup,
  changePassword,
  resetPassword,
  forgottenPasswordFindUserAccount,
} = require("@MEControllers/studentAuthController/studentAuthController");

const {
  signupSendOtp,
  signupOtpVerification,
  forgottenPasswordSendOtp,
  forgottenPasswordOtpVerification,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const router = express.Router();

router.route("/signin").post(signin);

router.route("/signup").post(signup);

router.route("/signup/send-otp").post(signupSendOtp);

router.route("/signup/otp-verification").post(signupOtpVerification);

router.route("/forgotten-password").post(forgottenPasswordFindUserAccount);

router.route("/forgotten-password/send-otp").get(forgottenPasswordSendOtp);

router
  .route("/forgotten-password/otp-verification")
  .get(forgottenPasswordOtpVerification);

router.route("/forgotten-password/reset-password").post(resetPassword);

router.route("/change-password").post(changePassword);

router.route("/schools").get(changePassword);

router.route("/profile").get(changePassword).post(changePassword).put(changePassword);

router
  .route("/admissions")
  .get(changePassword)
  .post(changePassword)
  .put(changePassword)
  .delete(changePassword);

module.exports = router;
