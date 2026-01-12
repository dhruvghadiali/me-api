const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  getAdmissionApplications,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route("/admission-applications")
  .get(schoolAdminProtect, getAdmissionApplications);

module.exports = router;
