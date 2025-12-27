const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  validateAddAddressProfilePostReqBody,
} = require("@MEControllerValidators/addressProfileValidator");
const { addAddress } = require("@MEControllers/addressProfileController");

const router = express.Router();

router
  .route("/profile/addresses")
  .post(studentProtect, validateAddAddressProfilePostReqBody, addAddress);

module.exports = router;
