const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const { addParentProfile } = require("@MEControllers/parentProfileController");
const {
  validateAddParentProfilePostReqBody,
} = require("@MEControllerValidators/parentProfileValidator");

const router = express.Router();

router
  .route("/profile/parent")
  .post(studentProtect, validateAddParentProfilePostReqBody, addParentProfile);

module.exports = router;
