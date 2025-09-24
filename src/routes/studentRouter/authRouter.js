const express = require("express");

const {
  signUp,
} = require("@MEControllers/studentAuthController/studentAuthController");

const {
  validateStudentSignupPostReqBody,
} = require("@MEControllers/studentAuthController/studentAuthValidation");

// const {
//   signUpSendOTP,
//   signUpOTPVerification,
//   forgottenPasswordSendOTP,
//   forgottenPasswordOTPVerification,
// } = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const router = express.Router();

// /**
//  * @swagger
//  * /signin:
//  *   post:
//  *     summary: Create a new user account for student
//  *     description: This API allows student to sign in to their account.
//  *     tags: [Student]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - username
//  *               - password
//  *             properties:
//  *               username:
//  *                 type: string
//  *                 description: The username of the user (Student).
//  *                 example: "student123"
//  *               password:
//  *                 type: string
//  *                 description: The password of the user (Student).
//  *                 example: "Student@123"
//  *     responses:
//  *       200:
//  *         description: Students signin process successfully completed
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                  type: array
//  *                  example: [
//  *                    {
//  *                      "_id": "67daf6b639fe768cb8cdcca8",
//  *                      "first_name": "first name",
//  *                      "last_name": "last name",
//  *                      "email": "testemail@domain.com",
//  *                      "phone_number": "1234567890",
//  *                      "username": "student123",
//  *                      "is_account_verified": true,
//  *                      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGFmNmI2MzlmZTc2OGNiOGNkY2NhOCIsImlhdCI6MTc0Mjk5ODQ1OSwiZXhwIjoxNzQyOTk4NTE5fQ.2N94qPTXdxIxF8DgHYCPbh7qbM7qovxabBfvpiTfG4A",
//  *                      "id": "67daf6b639fe768cb8cdcca8"
//  *                    }
//  *                  ]
//  *                 message:
//  *                  type: string
//  *                  example: "Students signin process successfully completed"
//  *                 status:
//  *                  type: number
//  *                  example: 200
//  *       400:
//  *         description: Bad request - Invalid format
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
//  *                  example: "Invalid format"
//  *                 status:
//  *                  type: number
//  *                  example: 400
//  *       401:
//  *         description: Invalid credentials
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
//  *                  example: "Invalid credentials"
//  *                 status:
//  *                  type: number
//  *                  example: 400
//  */
// router.route("/signin").post(signIn);

router.route("/signup").post(validateStudentSignupPostReqBody, signUp);

// router.route("/signup/send-otp").post(signUpSendOTP);

// router.route("/signup/otp-verification").post(signUpOTPVerification);

// router.route("/forgotten-password").post(forgottenPasswordFindUserAccount);

// router.route("/forgotten-password/send-otp").post(forgottenPasswordSendOTP);

// router
//   .route("/forgotten-password/otp-verification")
//   .post(forgottenPasswordOTPVerification);

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

// router.route("/change-password").post(changePassword);

// router
//   .route("/profile")
//   .get(changePassword)
//   .post(changePassword)
//   .put(changePassword);

module.exports = router;
