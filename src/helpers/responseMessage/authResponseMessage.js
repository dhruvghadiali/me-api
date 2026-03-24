const authResponseMessage = {
  // OTP related messages
  emailOTPInvalid: "Invalid email OTP",
  phoneOTPInvalid: "Invalid phone OTP",
  otpVerificationTimeExpire: "OTP validation time is expired",
  otpSendSuccess: "OTP send successfully on your register email and phone",
  
  // Sign up related messages
  signUpOTPVerificationError: "OTP validation failed please try after sometime",
  signUpOTPVerificationSuccess: `Signup OTP verification process successfully completed`,

  // Authentication related messages
  invalidCredentials: "Invalid credentials",
  jwtTokenError: "Not authorize to access this route",
  jwtTokenExpire: "Unauthorized: Access token is expired",
  accountDetailsRequired: "Please provide account details",
  unauthorizedUser: "Unauthorized: Access is denied due to invalid credentials",

  // Forgotten password related messages
  forgottenPasswordFindUserAccountSuccess: "Account details found",
  forgottenPasswordResetPasswordSuccess: "User password reset successfully",
  forgottenPasswordOTPVerificationError: `OTP validation failed please try after sometime`,
  forgottenPasswordFindUserAccountError: `This account details are not present in over database`,
  forgottenPasswordResetPasswordError: `User password is not reset right now, Please after sometime`,
  forgottenPasswordOTPVerificationSuccess: `Forgotten password OTP verification process successfully completed`,

  // Super admin related messages
  superAdminSignUpError: "Super admin already exist in our database",
  superAdminSignUpSuccess: "Super admin signup process successfully completed",
  superAdminSignUpDBError: `Super admin signup process failed, Please try after sometime`,
  superAdminSignUpActivationError: `Super admin account activation failed, Please try after sometime`,
  superAdminSignInSuccess: "Super admin signin process successfully completed",
  superAdminPasswordChangedSuccess: "Super admin password changed successfully",
  superAdminPasswordChangedError: `Super admin password changed failed, Please try after sometime`,

  // School admin related messages
  schoolAdminDetailsRequired: "School admin details are required",
  schoolAdminInformationNotFound: `School admin information not found`,
  schoolAdminProfilePutSuccess: `School admin profile updated successfully`,
  schoolAdminSignInSuccess: `School admin signin process successfully completed`,
  schoolAdminChangePasswordSuccess: `School admin password updated successfully`,
  schoolAdminChangePasswordError: `Facing issue while updating school admin password`,
  schoolAdminProfilePutError: `Facing issue while updating school admin profile details`,

  // Student related messages
  studentChangePasswordSuccess: `Student password updated successfully`,
  studentInformationNotFound: `Student information not found`,

  // Password related messages
  invalidPassword: `Invalid password please try again`,
  newPasswordUpdatedSuccess: `New password has been updated successfully`,
  existingPasswordInvalid: `Existing password is incorrect please try again`,
  existingPasswordAndNewPasswordSameError: `Existing password and new password cannot be the same`,

  // Username related messages
  usernameUpdatedSuccess: `Username has been updated successfully`,
  usernameIsAlreadyInUse: `Username is already taken by another user`,
  existingUsernameAndNewUsernameSameError: `Existing username and new username cannot be the same`,
};

module.exports = authResponseMessage;
