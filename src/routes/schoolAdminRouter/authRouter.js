const express = require("express");

const {
  signIn,
} = require("@MEControllers/schoolAdminAuthController/schoolAdminAuthController");

const router = express.Router();

/**
 * @swagger
 * /school-admin/signin:
 *   post:
 *     summary: School admin sign in
 *     tags: [School Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: School admin username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: School admin password
 *     responses:
 *       200:
 *         description: Successful sign in, returns JWT token and user info
 *       400:
 *         description: Invalid credentials or validation error
 */

router.route("/signin").post(signIn);

module.exports = router;
