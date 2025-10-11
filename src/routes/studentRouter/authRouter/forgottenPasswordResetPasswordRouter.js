const express = require("express");

const {} = require("@MEControllers/studentAuthController/studentAuthController");

const router = express.Router();

// /**
//  * @swagger
//  * /forgotten-password/reset-password:
//  *   post:
//  *     summary: Reset user password
//  *     description: This API allows users to reset their password.
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - user_id
//  *               - reset_password_toke
//  *               - password
//  *             properties:
//  *               user_id:
//  *                 type: string
//  *                 description: The ID of the user.
//  *                 example: "64d9b23f9a2a1b001fa2e"
//  *               reset_password_toke:
//  *                 type: string
//  *                 description: The token required for resetting the password.
//  *                 example: "123456"
//  *               password:
//  *                 type: string
//  *                 description: The new password to set.
//  *                 example: "NewSecurePass123"
//  *     responses:
//  *       200:
//  *         description: Password reset successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                  type: array
//  *                  example: []
//  *                 message:
//  *                  type: string
//  *                  example: "Password reset successfully"
//  *                 status:
//  *                  type: number
//  *                  example: 200
//  *       400:
//  *         description: Bad request - Missing parameters
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Password reset successfully"
//  *       404:
//  *         description: User not found or conditions not met
//  *       500:
//  *         description: Internal server error
//  */
// router.route("/forgotten-password/reset-password").post(resetPassword);

module.exports = router;
