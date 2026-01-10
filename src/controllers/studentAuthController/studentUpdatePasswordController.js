const { asyncHandler } = require("@MEMiddleware/async");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { USER_TYPES, HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  invalidFormat,
  existingPasswordInvalid,
  newPasswordUpdatedSuccess,
  studentInformationNotFound,
  existingPasswordAndNewPasswordSameError,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update student password
 * @route   PUT /student/update-password
 * @access  Student
 */
const updatePassword = asyncHandler(async (req, res, next) => {
  const { existing_password, new_password } = req.body;
  const userId = req.user.id;

  // Validate request body
  if (!existing_password || !new_password) {
    return next(new ErrorResponse(invalidFormat, HTTP_STATUS_CODES.STATUS_400));
  }

  // Check if new password and existing password are same
  if (existing_password === new_password) {
    return next(
      new ErrorResponse(
        existingPasswordAndNewPasswordSameError,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Find student user by id
  const user = await User.findById(userId)
    .select("+password")
    .where("user_type")
    .equals(USER_TYPES.STUDENT);

  if (!user) {
    return next(
      new ErrorResponse(
        studentInformationNotFound,
        HTTP_STATUS_CODES.STATUS_404
      )
    );
  }

  // Check if existing password matches
  const isPasswordMatch = await user.matchPassword(existing_password);

  if (!isPasswordMatch) {
    return next(
      new ErrorResponse(existingPasswordInvalid, HTTP_STATUS_CODES.STATUS_401)
    );
  }

  // Update password
  user.password = new_password;
  await user.save();

  // Remove sensitive data from response
  delete user._doc.password;

  // Send success response
  res.status(HTTP_STATUS_CODES.STATUS_200).json({
    data: [user],
    message: newPasswordUpdatedSuccess,
    status: HTTP_STATUS_CODES.STATUS_200,
  });
});

module.exports = {
  updatePassword,
};
