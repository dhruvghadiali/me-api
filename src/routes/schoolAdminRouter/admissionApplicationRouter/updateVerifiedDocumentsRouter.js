const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  updateVerifiedDocuments,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route("/admission-applications/:id/verified-documents")
  .put(schoolAdminProtect, updateVerifiedDocuments);

module.exports = router;
