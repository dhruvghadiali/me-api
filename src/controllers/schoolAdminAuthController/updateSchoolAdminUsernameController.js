const { asyncHandler } = require("@MEMiddleware/async");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { USER_TYPES, HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  invalidFormat,
  invalidPassword,
  usernameUpdatedSuccess,
  usernameIsAlreadyInUse,
  schoolAdminInformationNotFound,
  existingUsernameAndNewUsernameSameError,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update school admin username
 * @route   PUT /school-admin/update-username
 * @access  School Admin
 */
const updateSchoolAdminUsername = asyncHandler(async (req, res, next) => {
  const { new_username, password } = req.body;
  const userId = req.user.id;

  // Validate request body
  if (!new_username || !password) {
    return next(new ErrorResponse(invalidFormat, HTTP_STATUS_CODES.STATUS_400));
  }

  // Find school admin user by id with password field
  const user = await User.findById(userId)
    .select("+password")
    .where("user_type")
    .equals(USER_TYPES.SCHOOL_ADMIN);

  if (!user) {
    return next(
      new ErrorResponse(
        schoolAdminInformationNotFound,
        HTTP_STATUS_CODES.STATUS_404
      )
    );
  }

  // Verify password is correct
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return next(
      new ErrorResponse(invalidPassword, HTTP_STATUS_CODES.STATUS_400)
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

  // Build User update object with user-related fields
  const userUpdateData = {
    ...(req.body.new_username && { username: req.body.new_username }),
  };

  // Update User model if user-related fields are provided
  if (Object.keys(userUpdateData).length > 0) {
    await User.findByIdAndUpdate(req.user.id, userUpdateData, {
      new: true,
      runValidators: true,
    });

    // Send success response
    res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [],
      message: usernameUpdatedSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  } else {
    return next(new ErrorResponse(invalidFormat, HTTP_STATUS_CODES.STATUS_400));
  }
});

module.exports = {
  updateSchoolAdminUsername,
};
