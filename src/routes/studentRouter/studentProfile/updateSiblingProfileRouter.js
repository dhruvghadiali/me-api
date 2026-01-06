const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  updateSiblingProfile,
} = require("@MEControllers/siblingProfileController");
const {
  validateUpdateSiblingProfilePutReqBody,
} = require("@MEControllerValidators/siblingProfileValidator");

const router = express.Router();

router
  .route("/profile/sibling/:id")
  .put(
    studentProtect,
    validateUpdateSiblingProfilePutReqBody,
    updateSiblingProfile
  );

module.exports = router;
