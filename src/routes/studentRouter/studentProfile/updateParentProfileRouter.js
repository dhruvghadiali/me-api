const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  updateParentProfile,
} = require("@MEControllers/parentProfileController");
const {
  validateUpdateParentProfilePutReqBody,
} = require("@MEControllerValidators/parentProfileValidator");

const router = express.Router();

router
  .route("/profile/parent/:id")
  .put(
    studentProtect,
    validateUpdateParentProfilePutReqBody,
    updateParentProfile
  );

module.exports = router;
