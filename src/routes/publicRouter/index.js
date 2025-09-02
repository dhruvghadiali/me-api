const express = require("express");

const {
  getSchoolsSummary,
} = require("@MEControllers/schoolController/schoolController");

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
router.route("/schools").get(getSchoolsSummary);

module.exports = router;
