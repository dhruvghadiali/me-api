const express = require("express");

const {
  forgottenPasswordFindUserAccount,
} = require("@MEControllers/studentAuthController/studentAuthController");

const {
  validateAccountName,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router
  .route("/forgotten-password")
  .post(validateAccountName, forgottenPasswordFindUserAccount);

module.exports = router;
