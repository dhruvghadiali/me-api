const express = require("express");
const { testRoute } = require("../controller/testController");
const {
  signin,
  signup,
  changePassword,
  resetPassword,
  forgottenPasswordFindUserAccount,
} = require("../controller/studentAuthController/studentAuthController");

const {
  signupSendOtp,
  signupOtpVerification,
  forgottenPasswordSendOtp,
  forgottenPasswordOtpVerification,
} = require("../controller/studentAuthController/studentAuthVerificationController");

const router = express.Router();

router.route("/signin").post(signin);

router.route("/signup").post(signup);

router.route("/signup/send-otp").post(signupSendOtp);

router.route("/signup/otp-verification").get(signupOtpVerification);

router.route("/forgotten-password").get(forgottenPasswordFindUserAccount);

router.route("/forgotten-password/send-otp").get(forgottenPasswordSendOtp);

router
  .route("/forgotten-password/otp-verification")
  .get(forgottenPasswordOtpVerification);

router.route("/forgotten-password/reset-password").post(resetPassword);

router.route("/change-password").post(changePassword);

router.route("/schools").get(testRoute);

router.route("/profile").get(testRoute).post(testRoute).put(testRoute);

router
  .route("/admissions")
  .get(testRoute)
  .post(testRoute)
  .put(testRoute)
  .delete(testRoute);

module.exports = router;
