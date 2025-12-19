const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  updateAdmissionApplicationStatus,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route("/admission-applications/:id/status")
  .put(schoolAdminProtect, updateAdmissionApplicationStatus);

module.exports = router;
