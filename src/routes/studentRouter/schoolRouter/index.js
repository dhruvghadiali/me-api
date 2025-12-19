const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  getSchool,
  getSchoolsSummary,
} = require("@MEControllers/schoolController/schoolController");

const {
  getSchoolAcademicClasses,
} = require("@MEControllers/schoolController/getSchoolAcademicClassesController");

const router = express.Router();

/**
 * @swagger
 * /schools:
 *   get:
 *     summary: Get all schools list
 *     tags: [Public]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schools
 *       400:
 *         description: Invalid request or validation error
 *       401:
 *         description: Unauthorized
 */
router.route("/schools").get(studentProtect, getSchoolsSummary);
router.route("/school/:id").get(studentProtect, getSchool);
router
  .route("/schools/academic-classes")
  .get(studentProtect, getSchoolAcademicClasses);

module.exports = router;
