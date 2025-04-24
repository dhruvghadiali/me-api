const {
  otpLength,
  verificationTokenMinChar,
  verificationTokenMaxChar,
} = require("@MEHelpers/validationConst");

const authValidationMessage = {
  verificationTokenRequired: "Verification token is required",
  verificationMaxLength: `Verification token must be less then ${verificationTokenMaxChar} characters`,
  verificationMinLength: `Verification token must be greater then ${verificationTokenMinChar} characters`,
  emailOTPRequired: "Email OTP is required",
  emailOTPMaxLength: `Email OTP must be ${otpLength} digit`,
  emailOTPMinLength: `Email OTP must be ${otpLength} digit`,
  phoneOTPRequired: "Phone OTP is required",
  phoneOTPMaxLength: `Phone OTP must be ${otpLength} digit`,
  phoneOTPMinLength: `Phone OTP must be ${otpLength} digit`,
  otpExpiryDateTimeRequired: "OTP expiry datetime is required",
};

module.exports = authValidationMessage;
