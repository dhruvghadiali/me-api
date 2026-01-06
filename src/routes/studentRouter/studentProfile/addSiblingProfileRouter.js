const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  addSiblingProfile,
} = require("@MEControllers/siblingProfileController");
const {
  validateAddSiblingProfilePostReqBody,
} = require("@MEControllerValidators/siblingProfileValidator");

const router = express.Router();

router
  .route("/profile/sibling")
  .post(
    studentProtect,
    validateAddSiblingProfilePostReqBody,
    addSiblingProfile
  );

module.exports = router;
