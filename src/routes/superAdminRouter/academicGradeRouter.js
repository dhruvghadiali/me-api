const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addAcademicGrade,
  getAcademicGrades,
  updateAcademicGrade,
  deleteAcademicGrade,
} = require("@MEControllers/academicGradeController/academicGradeController");

const router = express.Router();

router
  .route("/academic-grades")
  .get(protect, getAcademicGrades)
  .post(protect, addAcademicGrade);
router
  .route("/academic-grades/:id")
  .put(protect, updateAcademicGrade)
  .delete(protect, deleteAcademicGrade);

module.exports = router;
