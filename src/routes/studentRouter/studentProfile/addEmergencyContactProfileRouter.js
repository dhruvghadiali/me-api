const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  addEmergencyContact,
} = require("@MEControllers/emergencyContactProfileController");
const {
  validateAddEmergencyContactProfilePostReqBody,
} = require("@MEControllerValidators/emergencyContactProfileValidator");

const router = express.Router();

router
  .route("/profile/emergency-contact")
  .post(
    studentProtect,
    validateAddEmergencyContactProfilePostReqBody,
    addEmergencyContact
  );

module.exports = router;
