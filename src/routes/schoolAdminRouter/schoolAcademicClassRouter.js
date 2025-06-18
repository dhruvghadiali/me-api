const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  addSchoolAcademicClass,
  getSchoolAcademicClasses,
  deleteSchoolAcademicClass,
} = require("@MEControllers/schoolAcademicClassController/schoolAcademicClassController");
const {
  validateSchoolAcademicClassPostReqBody,
  validateSchoolAcademicClassQueryParamsForId,
  validateSchoolAcademicClassQueryParamsForSchool,
  validateSchoolAcademicClassDeleteQueryParamsForEducationBoard,
} = require("@MEControllers/schoolAcademicClassController/schoolAcademicClassValidation");

const router = express.Router();

/**
 * @swagger
 * /school-admin/school-academic-classes:
 *   post:
 *     summary: Add a new school academic class
 *     tags: [School Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school
 *               - education_board
 *               - academic_class
 *             properties:
 *               school:
 *                 type: string
 *                 description: School ID
 *               education_board:
 *                 type: string
 *                 description: Education Board ID (must belong to the school)
 *               academic_class:
 *                 type: string
 *                 description: Academic Class ID
 *     responses:
 *       201:
 *         description: School academic class created successfully
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized
 *
 * /school-admin/school-academic-classes/{id}:
 *   delete:
 *     summary: Delete a school academic class by ID
 *     tags: [School Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School Academic Class ID
 *     responses:
 *       200:
 *         description: School academic class deleted successfully
 *       400:
 *         description: Invalid ID or validation error
 *       401:
 *         description: Unauthorized
 * /school-admin/school-academic-classes/{school}:
 *   get:
 *     summary: Get all school academic classes for a school
 *     tags: [School Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: school
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: List of school academic classes
 *       400:
 *         description: Invalid parameters or validation error
 *       401:
 *         description: Unauthorized
 * /school-admin/school-academic-classes/{school}/{education_board}:
 *   get:
 *     summary: Get all school academic classes for a school and education board
 *     tags: [School Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: school
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *       - in: path
 *         name: education_board
 *         required: true
 *         schema:
 *           type: string
 *         description: Education Board ID
 *     responses:
 *       200:
 *         description: List of school academic classes
 *       400:
 *         description: Invalid parameters or validation error
 *       401:
 *         description: Unauthorized
 */

router
  .route("/school-academic-classes")
  .post(
    schoolAdminProtect,
    validateSchoolAcademicClassPostReqBody,
    addSchoolAcademicClass
  );

router
  .route("/school-academic-classes/:id")
  .delete(
    schoolAdminProtect,
    validateSchoolAcademicClassQueryParamsForId,
    deleteSchoolAcademicClass
  );

router
  .route("/school-academic-classes/:school")
  .get(
    schoolAdminProtect,
    validateSchoolAcademicClassQueryParamsForSchool,
    getSchoolAcademicClasses
  );

router
  .route("/school-academic-classes/:school/:education_board")
  .get(
    schoolAdminProtect,
    validateSchoolAcademicClassQueryParamsForSchool,
    validateSchoolAcademicClassDeleteQueryParamsForEducationBoard,
    getSchoolAcademicClasses
  );

module.exports = router;
