const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  getAdmissionApplicationSummary,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route("/admission-applications/summary")
  .get(schoolAdminProtect, getAdmissionApplicationSummary);

module.exports = router;
