const express = require("express");

const { protect } = require("@MEMiddleware/auth");
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
  .get(protect, getAcademicClasses)
  .post(protect, validateAcademicClassPostReqBody, addAcademicClass);
router
  .route("/academic-classes/:id")
  .put(
    protect,
    validateAcademicClassQueryParams,
    validateAcademicClassPutReqBody,
    updateAcademicClass
  )
  .delete(protect, validateAcademicClassQueryParams, deleteAcademicClass);

module.exports = router;
