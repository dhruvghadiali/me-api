/**
 * OTP Verification Types enumeration
 * Defines the different types of OTP verification processes
 */
const OTP_VERIFICATION_TYPES = Object.freeze({
  SIGN_UP: "SU", // Sign Up verification
  FORGOT_PASSWORD: "FP", // Forgot Password verification
});

/**
 * OTP Status enumeration
 * Defines the verification status of OTP
 */
const OTP_STATUS = Object.freeze({
  VERIFIED: true,
  UNVERIFIED: false,
});

/**
 * OTP Configuration constants
 */
const OTP_CONFIG = Object.freeze({
  EXPIRE_MINUTES: 15,
  MIN_VALUE: 100000,
  MAX_VALUE: 999999,
});

module.exports = {
  OTP_VERIFICATION_TYPES,
  OTP_STATUS,
  OTP_CONFIG,
};
