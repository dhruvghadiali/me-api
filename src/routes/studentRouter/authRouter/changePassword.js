const express = require("express");

const {
  changePassword,
} = require("@MEControllers/studentAuthController/studentAuthController");

// const {
//   validateStudentOTPVerificationPostReqBody,
// } = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router.route("/forgotten-password/change-password").post(changePassword);

module.exports = router;
