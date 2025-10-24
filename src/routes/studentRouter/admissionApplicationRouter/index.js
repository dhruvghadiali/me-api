const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  addAdmissionApplication,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route("/admission-applications")
  .post(studentProtect, addAdmissionApplication);

module.exports = router;
