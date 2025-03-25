const express = require("express");

const {
  signIn,
  signUp,
  changePassword,
  resetPassword,
  forgottenPasswordFindUserAccount,
} = require("@MEControllers/studentAuthController/studentAuthController");

const {
  signUpSendOTP,
  signUpOTPVerification,
  forgottenPasswordSendOTP,
  forgottenPasswordOTPVerification,
} = require("@MEControllers/studentAuthController/studentAuthVerificationController");

const router = express.Router();

router.route("/signin").post(signIn);

router.route("/signup").post(signUp);

router.route("/signup/send-otp").post(signUpSendOTP);

router.route("/signup/otp-verification").post(signUpOTPVerification);

router.route("/forgotten-password").post(forgottenPasswordFindUserAccount);

router.route("/forgotten-password/send-otp").post(forgottenPasswordSendOTP);

router
  .route("/forgotten-password/otp-verification")
  .post(forgottenPasswordOTPVerification);

/**
 * @swagger
 * /forgotten-password/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: This API allows users to reset their password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - reset_password_toke
 *               - password
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The ID of the user.
 *                 example: "64d9b23f9a2a1b001fa2e"
 *               reset_password_toke:
 *                 type: string
 *                 description: The token required for resetting the password.
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 description: The new password to set.
 *                 example: "NewSecurePass123"
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                  example: "Password reset successfully"
 *                 status:
 *                  type: number
 *                  example: 200
 *       400:
 *         description: Bad request - Missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 *       404:
 *         description: User not found or conditions not met
 *       500:
 *         description: Internal server error
 */
router.route("/forgotten-password/reset-password").post(resetPassword);

router.route("/change-password").post(changePassword);

router.route("/schools").get(changePassword);

router
  .route("/profile")
  .get(changePassword)
  .post(changePassword)
  .put(changePassword);

router
  .route("/admissions")
  .get(changePassword)
  .post(changePassword)
  .put(changePassword)
  .delete(changePassword);

module.exports = router;
