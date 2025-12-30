const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  addStudentProfile,
} = require("@MEControllers/studentProfileController");
const {
  validateAddStudentProfilePostReqBody,
} = require("@MEControllerValidators/studentProfileValidator");

const router = express.Router();

router
  .route("/profile")
  .post(
    studentProtect,
    validateAddStudentProfilePostReqBody,
    addStudentProfile
  );

module.exports = router;
