const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  addAcademicClass,
  getAcademicClasses,
  updateAcademicClass,
  deleteAcademicClass,
} = require("@MEControllers/academicClassController/academicClassController");
const {
  validateAcademicClassPutReqBody,
  validateAcademicClassPostReqBody,
  validateAcademicClassQueryParams,
} = require("@MEControllers/academicClassController/academicClassValidation");

const router = express.Router();

router
  .route("/academic-classes")
  .get(superAdminProtect, getAcademicClasses)
  .post(superAdminProtect, validateAcademicClassPostReqBody, addAcademicClass);
router
  .route("/academic-classes/:id")
  .put(
    superAdminProtect,
    validateAcademicClassQueryParams,
    validateAcademicClassPutReqBody,
    updateAcademicClass
  )
  .delete(
    superAdminProtect,
    validateAcademicClassQueryParams,
    deleteAcademicClass
  );

module.exports = router;
