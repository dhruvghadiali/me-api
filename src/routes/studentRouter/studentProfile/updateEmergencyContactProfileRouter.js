const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  updateEmergencyContact,
} = require("@MEControllers/emergencyContactProfileController");
const {
  validateUpdateEmergencyContactProfilePutReqBody,
} = require("@MEControllerValidators/emergencyContactProfileValidator");

const router = express.Router();

router
  .route("/profile/emergency-contact/:id")
  .put(
    studentProtect,
    validateUpdateEmergencyContactProfilePutReqBody,
    updateEmergencyContact
  );

module.exports = router;
