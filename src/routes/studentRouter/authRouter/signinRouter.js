const express = require("express");

const {
  signIn,
} = require("@MEControllers/studentAuthController/studentAuthController");

const {
  validateStudentSigninPostReqBody,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

const router = express.Router();

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Create a new user account for student
 *     description: This API allows student to sign in to their account.
 *     tags: [Student]
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
 *                 description: The username of the user (Student).
 *                 example: "student123"
 *               password:
 *                 type: string
 *                 description: The password of the user (Student).
 *                 example: "Student@123"
 *     responses:
 *       200:
 *         description: Students signin process successfully completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                  type: array
 *                  example: [
 *                    {
 *                      "_id": "67daf6b639fe768cb8cdcca8",
 *                      "first_name": "first name",
 *                      "last_name": "last name",
 *                      "email": "testemail@domain.com",
 *                      "phone_number": "1234567890",
 *                      "username": "student123",
 *                      "is_account_verified": true,
 *                      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGFmNmI2MzlmZTc2OGNiOGNkY2NhOCIsImlhdCI6MTc0Mjk5ODQ1OSwiZXhwIjoxNzQyOTk4NTE5fQ.2N94qPTXdxIxF8DgHYCPbh7qbM7qovxabBfvpiTfG4A",
 *                      "id": "67daf6b639fe768cb8cdcca8"
 *                    }
 *                  ]
 *                 message:
 *                  type: string
 *                  example: "Students signin process successfully completed"
 *                 status:
 *                  type: number
 *                  example: 200
 *       400:
 *         description: Bad request - Invalid format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                  type: array
 *                  example: []
 *                 message:
 *                  type: string
 *                  example: "Invalid format"
 *                 status:
 *                  type: number
 *                  example: 400
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                  type: array
 *                  example: []
 *                 message:
 *                  type: string
 *                  example: "Invalid credentials"
 *                 status:
 *                  type: number
 *                  example: 400
 */
router.route("/signin").post(validateStudentSigninPostReqBody, signIn);

module.exports = router;
