const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addAdmissionDocument,
  getAdmissionDocuments,
  updateAdmissionDocument,
  deleteAdmissionDocument,
} = require("@MEControllers/admissionDocumentController/admissionDocumentController");
const {
  validateAdmissionDocumentsPutReqBody,
  validateAdmissionDocumentsPostReqBody,
  validateAdmissionDocumentsQueryParams,
} = require("@MEControllers/admissionDocumentController/admissionDocumentValidation");

const router = express.Router();

router
  .route("/admission-documents")
  .get(protect, getAdmissionDocuments)
  .post(protect, validateAdmissionDocumentsPostReqBody, addAdmissionDocument);
router
  .route("/admission-documents/:id")
  .put(
    protect,
    validateAdmissionDocumentsQueryParams,
    validateAdmissionDocumentsPutReqBody,
    updateAdmissionDocument
  )
  .delete(
    protect,
    validateAdmissionDocumentsQueryParams,
    deleteAdmissionDocument
  );

module.exports = router;
