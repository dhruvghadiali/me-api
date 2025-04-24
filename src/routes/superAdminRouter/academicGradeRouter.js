const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addAcademicGrade,
  getAcademicGrades,
  updateAcademicGrade,
  deleteAcademicGrade,
} = require("@MEControllers/academicGradeController/academicGradeController");
const {
  validateAcademicGradesPutReqBody,
  validateAcademicGradesPostReqBody,
  validateAcademicGradesQueryParams,
} = require("@MEControllers/academicGradeController/academicGradeValidation");

const router = express.Router();

router
  .route("/academic-grades")
  .get(protect, getAcademicGrades)
  .post(protect, validateAcademicGradesPostReqBody, addAcademicGrade);
router
  .route("/academic-grades/:id")
  .put(
    protect,
    validateAcademicGradesQueryParams,
    validateAcademicGradesPutReqBody,
    updateAcademicGrade
  )
  .delete(protect, validateAcademicGradesQueryParams, deleteAcademicGrade);

module.exports = router;
