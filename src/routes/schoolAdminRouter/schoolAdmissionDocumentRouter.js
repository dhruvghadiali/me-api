const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  addSchoolAdmissionDocument,
  getSchoolAdmissionDocuments,
  updateSchoolAdmissionDocument,
  deleteSchoolAdmissionDocument,
} = require("@MEControllers/schoolAdmissionDocumentController/schoolAdmissionDocumentController");
const {
  validateSchoolAdmissionDocumentPostReqBody,
  validateSchoolAdmissionDocumentPutReqBody,
  validateSchoolAdmissionDocumentQueryParams,
  validateSchoolAdmissionDocumentAcademicClassQueryParams,
} = require("@MEControllers/schoolAdmissionDocumentController/schoolAdmissionDocumentValidation");

const router = express.Router();

router
  .route("/school-admission-documents")
  .post(
    schoolAdminProtect,
    validateSchoolAdmissionDocumentPostReqBody,
    addSchoolAdmissionDocument
  );
router
  .route("/school-admission-documents/:school_academic_class")
  .get(
    schoolAdminProtect,
    validateSchoolAdmissionDocumentAcademicClassQueryParams,
    getSchoolAdmissionDocuments
  );

router
  .route("/school-admission-documents/:id")
  .put(
    schoolAdminProtect,
    validateSchoolAdmissionDocumentQueryParams,
    validateSchoolAdmissionDocumentPutReqBody,
    updateSchoolAdmissionDocument
  )
  .delete(
    schoolAdminProtect,
    validateSchoolAdmissionDocumentQueryParams,
    deleteSchoolAdmissionDocument
  );

module.exports = router;
