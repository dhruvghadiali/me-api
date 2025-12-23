const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  validateAddAdmissionApplicationPostReqBody,
} = require("@MEControllerValidators/admissionApplicationValidator");
const {
  addAdmissionApplication,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route("/admission-applications")
  .post(
    studentProtect,
    validateAddAdmissionApplicationPostReqBody,
    addAdmissionApplication
  );

module.exports = router;
