const express = require("express");

const signinRouter = require("@MERoutes/studentRouter/authRouter/signinRouter");
const signupRouter = require("@MERoutes/studentRouter/authRouter/signupRouter");
const changePassword = require("@MERoutes/studentRouter/authRouter/changePassword");
const signupSendOTP = require("@MERoutes/studentRouter/authRouter/signupSendOTPRouter");
const forgottenPassword = require("@MERoutes/studentRouter/authRouter/forgottenPasswordRouter");
const signupOTPVerificationRouter = require("@MERoutes/studentRouter/authRouter/signupOTPVerificationRouter");
const forgottenPasswordSendOTPRouter = require("@MERoutes/studentRouter/authRouter/forgottenPasswordSendOTPRouter");
const forgottenPasswordResetPasswordRouter = require("@MERoutes/studentRouter/authRouter/forgottenPasswordResetPasswordRouter");
const forgottenPasswordOTPVerificationRouter = require("@MERoutes/studentRouter/authRouter/forgottenPasswordOTPVerificationRouter");

const router = express.Router();

router.use("/", signinRouter);
router.use("/", signupRouter);
router.use("/", signupSendOTP);
router.use("/", changePassword);
router.use("/", forgottenPassword);
router.use("/", signupOTPVerificationRouter);
router.use("/", forgottenPasswordSendOTPRouter);
router.use("/", forgottenPasswordResetPasswordRouter);
router.use("/", forgottenPasswordOTPVerificationRouter);

module.exports = router;
