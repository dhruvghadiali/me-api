const express = require("express");

const {
  forgottenPasswordFindUserAccount,
} = require("@MEControllers/studentAuthController/studentAuthController");

const router = express.Router();

router.route("/forgotten-password").post(forgottenPasswordFindUserAccount);
// account_name must be string formate min 3 char and max 50 char

module.exports = router;
