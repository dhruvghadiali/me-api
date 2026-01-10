const { asyncHandler } = require("@MEMiddleware/async");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { USER_TYPES, HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  invalidFormat,
  invalidPassword,
  usernameUpdatedSuccess,
  usernameIsAlreadyInUse,
  studentInformationNotFound,
  existingUsernameAndNewUsernameSameError,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update student username
 * @route   PUT /student/update-username
 * @access  Student
 */
const updateUsername = asyncHandler(async (req, res, next) => {
  const { new_username, password } = req.body;
  const userId = req.user.id;

  // Validate request body
  if (!new_username || !password) {
    return next(new ErrorResponse(invalidFormat, HTTP_STATUS_CODES.STATUS_400));
  }

  // Find student user by id with password field
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

  // Verify password is correct
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return next(
      new ErrorResponse(invalidPassword, HTTP_STATUS_CODES.STATUS_401)
    );
  }

  // Check if new username is same as existing username
  if (user.username === new_username) {
    return next(
      new ErrorResponse(
        existingUsernameAndNewUsernameSameError,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Check if username is already taken by another user
  const existingUser = await User.findOne({
    username: new_username,
    _id: { $ne: userId },
  });

  if (existingUser) {
    return next(
      new ErrorResponse(usernameIsAlreadyInUse, HTTP_STATUS_CODES.STATUS_409)
    );
  }

  // Update username
  user.username = new_username;
  await user.save();

  // Send success response
  res.status(HTTP_STATUS_CODES.STATUS_200).json({
    data: [user],
    message: usernameUpdatedSuccess,
    status: HTTP_STATUS_CODES.STATUS_200,
  });
});

module.exports = {
  updateUsername,
};
