const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addAdmissionDocument,
  getAdmissionDocuments,
  updateAdmissionDocument,
  deleteAdmissionDocument,
} = require("@MEControllers/admissionDocumentController/admissionDocumentController");

const router = express.Router();

router
  .route("/admission-documents")
  .get(protect, getAdmissionDocuments)
  .post(protect, addAdmissionDocument);
router
  .route("/admission-documents/:id")
  .put(protect, updateAdmissionDocument)
  .delete(protect, deleteAdmissionDocument);

module.exports = router;
