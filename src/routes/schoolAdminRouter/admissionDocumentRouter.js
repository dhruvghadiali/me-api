const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  getAdmissionDocuments,
} = require("@MEControllers/admissionDocumentController/admissionDocumentController");

const router = express.Router();

router
  .route("/admission-documents")
  .get(superAdminProtect, getAdmissionDocuments);

module.exports = router;
