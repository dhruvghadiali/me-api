const {} = require("@MEHelpers/validationConst");

const studentAuthValidationMessage = {
  studentSignupReqBodyRequired: "Student signup request body is required",
  studentSignupReqBodyEmpty: "Student signup request body can't be  empty",
  studentSignupReqBodyBase: "Student signup request body has invalid formate",
  studentSignupReqBodyUnknown: `Student signup request body has unknown parameters`,
  studentSigninReqBodyRequired: "Student signin request body is required",
  studentSigninReqBodyEmpty: "Student signin request body can't be  empty",
  studentSigninReqBodyBase: "Student signin request body has invalid formate",
  studentSigninReqBodyUnknown: `Student signin request body has unknown parameters`,
  studentOTPVerificationReqBodyRequired: `Student OTP verification request body is required`,
  studentOTPVerificationReqBodyEmpty: `Student OTP verification request body can't be empty`,
  studentOTPVerificationReqBodyBase: `Student OTP verification request body has invalid format`,
  studentOTPVerificationReqBodyUnknown: `Student OTP verification request body has unknown parameters`,
  userIdRequired: "User ID is required",
  userIdEmpty: "User ID cannot be empty",
  userIdInvalid: "User ID must be a valid ObjectId",
  emailOtpRequired: "Email OTP is required",
  emailOtpInvalid: "Email OTP must be a valid number",
  emailOtpRange: "Email OTP must be between 100000 and 999999",
  phoneOtpRequired: "Phone OTP is required",
  phoneOtpInvalid: "Phone OTP must be a valid number",
  phoneOtpRange: "Phone OTP must be between 100000 and 999999",
  verificationTokenRequired: "Verification token is required",
  verificationTokenEmpty: "Verification token cannot be empty",
  verificationTokenInvalid: "Verification token must be a string",
  verificationTokenLength: "Verification token length is invalid",
};

module.exports = studentAuthValidationMessage;
