const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  getAcademicClasses,
} = require("@MEControllers/academicClassController/academicClassController");

const router = express.Router();

router.route("/academic-classes").get(protect, getAcademicClasses);

module.exports = router;
