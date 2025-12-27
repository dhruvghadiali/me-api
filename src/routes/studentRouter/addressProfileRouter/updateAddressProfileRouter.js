const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const { updateAddress } = require("@MEControllers/addressProfileController");
const {
  validateUpdateAddressProfilePutReqBody,
} = require("@MEControllerValidators/addressProfileValidator");

const router = express.Router();

router
  .route("/profile/addresses")
  .put(studentProtect, validateUpdateAddressProfilePutReqBody, updateAddress);

module.exports = router;
