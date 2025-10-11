const express = require("express");

const {
  signUp,
} = require("@MEControllers/studentAuthController/studentAuthController");

const {
  validateStudentSignupPostReqBody,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router.route("/signup").post(validateStudentSignupPostReqBody, signUp);

module.exports = router;
