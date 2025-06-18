const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
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
  .get(superAdminProtect, getAdmissionDocuments)
  .post(
    superAdminProtect,
    validateAdmissionDocumentsPostReqBody,
    addAdmissionDocument
  );
router
  .route("/admission-documents/:id")
  .put(
    superAdminProtect,
    validateAdmissionDocumentsQueryParams,
    validateAdmissionDocumentsPutReqBody,
    updateAdmissionDocument
  )
  .delete(
    superAdminProtect,
    validateAdmissionDocumentsQueryParams,
    deleteAdmissionDocument
  );

module.exports = router;
