const express = require("express");

const {
  forgottenPasswordFindUserAccount,
} = require("@MEControllers/studentAuthController/studentAuthController");

const {
  validateAccountNamePostReqBody,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router
  .route("/forgotten-password")
  .post(validateAccountNamePostReqBody, forgottenPasswordFindUserAccount);

module.exports = router;
