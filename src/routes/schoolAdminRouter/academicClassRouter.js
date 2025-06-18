const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  getAcademicClasses,
} = require("@MEControllers/academicClassController/academicClassController");

const router = express.Router();

/**
 * @swagger
 * /school-admin/academic-classes:
 *   get:
 *     summary: Get all academic classes
 *     tags: [School Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of academic classes
 *       400:
 *         description: Invalid request or validation error
 *       401:
 *         description: Unauthorized
 */
router.route("/academic-classes").get(schoolAdminProtect, getAcademicClasses);

module.exports = router;
