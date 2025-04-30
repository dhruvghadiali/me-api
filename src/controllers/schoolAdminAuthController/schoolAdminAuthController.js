const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolAdminProfilePutError,
  schoolAdminProfilePutSuccess,
  schoolAdminChangePasswordError,
  schoolAdminChangePasswordSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update school admin profile
 * @route   PUT /super-admin/school-admins/profile/:id
 * @access  Super Admin
 */
const updateSchoolAdminProfile = asyncHandler(async (req, res, next) => {
  // Find user id and update user details with user who signin
  const userInfo = await User.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  if (userInfo) {
    // Send response
    res.status(200).json({
      data: [userInfo],
      message: schoolAdminProfilePutSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAdminProfilePutError, 400));
  }
});

/**
 * @desc    Change password for school admin
 * @route   GET /super-admin/school-admins/change-password/:id
 * @access  Super Admin
 */
const changePassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  // Update school admin password and change is_active and is_account_verified status value to true.
  const user = await User.findOneAndUpdate(
    {
      _id: req.params.id,
      user_type: "SCHOOL_ADMIN",
    },
    { password: password, is_active: true, is_account_verified: true },
    { new: true, runValidators: true }
  );

  if (user) {
    // Send response
    res.status(200).json({
      data: [],
      message: schoolAdminChangePasswordSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAdminChangePasswordError, 400));
  }
});

module.exports = {
  changePassword,
  updateSchoolAdminProfile,
};
