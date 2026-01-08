const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const { addAddress } = require("@MEControllers/addressProfileController");
const {
  validateAddAddressProfilePostReqBody,
} = require("@MEControllerValidators/addressProfileValidator");

const router = express.Router();

router
  .route("/profile/address")
  .post(studentProtect, validateAddAddressProfilePostReqBody, addAddress);

module.exports = router;
