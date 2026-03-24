const { asyncHandler } = require("@MEMiddleware/async");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { USER_TYPES, HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  invalidFormat,
  existingPasswordInvalid,
  newPasswordUpdatedSuccess,
  schoolAdminInformationNotFound,
  existingPasswordAndNewPasswordSameError,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update school admin password
 * @route   PUT /school-admin/update-password
 * @access  School Admin
 */
const updateSchoolAdminPassword = asyncHandler(async (req, res, next) => {
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

  // Find school admin user by id
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

  // Check if existing password matches
  const isPasswordMatch = await user.matchPassword(existing_password);

  if (!isPasswordMatch) {
    return next(
      new ErrorResponse(existingPasswordInvalid, HTTP_STATUS_CODES.STATUS_400)
    );
  }

  // Build User update object with user-related fields
  const userUpdateData = {
    ...(req.body.new_password && { password: req.body.new_password }),
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
      message: newPasswordUpdatedSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  } else {
    return next(new ErrorResponse(invalidFormat, HTTP_STATUS_CODES.STATUS_400));
  }
});

module.exports = {
  updateSchoolAdminPassword,
};
