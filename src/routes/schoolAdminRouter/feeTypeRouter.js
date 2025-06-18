const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  getFeeTypes,
} = require("@MEControllers/feeTypeController/feeTypeController");

const router = express.Router();

/**
 * @swagger
 * /school-admin/fee-types:
 *   get:
 *     summary: Get all fee types
 *     tags: [School Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of fee types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                 message:
 *                   type: string
 *                 status:
 *                   type: number
 *             example:
 *               data: []
 *               message: "Fee types details found successfully"
 *               status: 200
 *       404:
 *         description: Fee types not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                 message:
 *                   type: string
 *                 status:
 *                   type: number
 *             example:
 *               data: []
 *               message: "Fee types details not found"
 *               status: 404
 */
router.route("/fee-types").get(schoolAdminProtect, getFeeTypes);

module.exports = router;
