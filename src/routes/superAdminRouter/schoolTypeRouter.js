const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addSchoolType,
  getSchoolTypes,
  updateSchoolType,
  deleteSchoolType,
} = require("@MEControllers/schoolTypeController/schoolTypeController");
const {
  validateSchoolTypesPutReqBody,
  validateSchoolTypesPostReqBody,
  validateSchoolTypesQueryParams,
} = require("@MEControllers/schoolTypeController/schoolTypeValidation");

const router = express.Router();

/**
 * @swagger
 * /super-admin/school-types:
 *   get:
 *     summary: Get all school types
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of school types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       school_type:
 *                         type: string
 *                       created_by:
 *                         type: string
 *                       updated_by:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 message:
 *                   type: string
 *                   example: "School types fetched successfully"
 *
 *   post:
 *     summary: Add a new school type or re-enable an existing one
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_type
 *             properties:
 *               school_type:
 *                 type: string
 *                 example: "private"
 *     responses:
 *       201:
 *         description: School type created or re-activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       school_type:
 *                         type: string
 *                       created_by:
 *                         type: string
 *                       updated_by:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 message:
 *                   type: string
 *                   example: "School type created successfully"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route("/school-types")
  .get(protect, getSchoolTypes)
  .post(protect, validateSchoolTypesPostReqBody, addSchoolType);
router
  .route("/school-types/:id")
  .put(
    protect,
    validateSchoolTypesQueryParams,
    validateSchoolTypesPutReqBody,
    updateSchoolType
  )
  .delete(protect, validateSchoolTypesQueryParams, deleteSchoolType);

module.exports = router;
