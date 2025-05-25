const express = require("express");

const {
  signIn,
} = require("@MEControllers/schoolAdminAuthController/schoolAdminAuthController");

const router = express.Router();

router.route("/signin").post(signIn);

module.exports = router;
