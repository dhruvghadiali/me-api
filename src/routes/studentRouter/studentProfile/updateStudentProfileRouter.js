const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  updateStudentProfile,
} = require("@MEControllers/studentProfileController");
const {
  validateUpdateStudentProfilePutReqBody,
} = require("@MEControllerValidators/studentProfileValidator");

const router = express.Router();

router
  .route("/profile/:id")
  .put(
    studentProtect,
    validateUpdateStudentProfilePutReqBody,
    updateStudentProfile
  );

module.exports = router;
