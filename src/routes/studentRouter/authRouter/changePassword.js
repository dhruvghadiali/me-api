const express = require("express");

const {
  changePassword,
} = require("@MEControllers/studentAuthController/studentAuthController");

const {
  validateChangePasswordPostReqBody,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

router
  .route("/forgotten-password/change-password")
  .post(validateChangePasswordPostReqBody, changePassword);

module.exports = router;
