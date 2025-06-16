const express = require("express");

const {
  signIn,
} = require("@MEControllers/schoolAdminAuthController/schoolAdminAuthController");
const {
  validateSchoolAdminSignInReqBody,
} = require("@MEControllers/schoolAdminAuthController/schoolAdminAuthValidation");

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
 *               message: "School admin signin process successfully completed"
 *               status: 200
 *       400:
 *         description: Invalid credentials or validation error
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
 *               message: "Invalid request format or missing required fields"
 *               status: 400
 *       401:
 *         description: Unauthorized, invalid username or password
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
 *               message: "Invalid username or password"
 *               status: 401
 */

router.route("/signin").post(validateSchoolAdminSignInReqBody, signIn);

module.exports = router;
