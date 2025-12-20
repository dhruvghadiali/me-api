const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  getAdmissionApplications,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route("/admission-applications")
  .get(studentProtect, getAdmissionApplications);

module.exports = router;
