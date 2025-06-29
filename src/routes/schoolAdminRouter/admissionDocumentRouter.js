const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  getAdmissionDocuments,
} = require("@MEControllers/admissionDocumentController/admissionDocumentController");

const router = express.Router();

router
  .route("/admission-documents")
  .get(schoolAdminProtect, getAdmissionDocuments);

module.exports = router;
