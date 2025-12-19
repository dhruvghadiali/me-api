const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  updateAdmissionApplicationStatus,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route("/admission-applications/:id/status")
  .put(studentProtect, updateAdmissionApplicationStatus);

module.exports = router;
