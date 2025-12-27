const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  validateAddEmergencyContactProfilePostReqBody,
} = require("@MEControllerValidators/emergencyContactProfileValidator");
const {
  addEmergencyContact,
} = require("@MEControllers/emergencyContactProfileController");

const router = express.Router();

router
  .route("/profile/emergency-contacts")
  .post(
    studentProtect,
    validateAddEmergencyContactProfilePostReqBody,
    addEmergencyContact
  );

module.exports = router;
