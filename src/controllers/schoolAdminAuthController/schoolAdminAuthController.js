const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolAdminProfilePutError,
  schoolAdminProfilePutSuccess,
  schoolAdminChangePasswordError,
  schoolAdminChangePasswordSuccess,
  invalidFormat,
  invalidCredentials,
  schoolAdminSignInSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Sign in school admin
 * @route   POST /school-admin/signin
 * @access  School Admin
 */
const signIn = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (username && password) {
    // Check username is present in DB or not with is_active and is_account_verified status value true and user_type must be school admin.
    const user = await User.findOne({
      username: username,
      is_active: true,
      is_account_verified: true,
      user_type: "SCHOOL_ADMIN",
    }).select("+password -__v");

    console.log("user", user);

    if (user) {
      // Check req body password with encrypted password stored in DB.
      const isPasswordMatch = await user.matchPassword(password);

      if (isPasswordMatch) {
        // Create new JWT token.
        let token = user.getSignedJwtToken();
        user._doc.token = token;
        delete user._doc.password;
        delete user._doc.user_type;

        // Send response
        res.status(200).json({
          data: [user],
          message: schoolAdminSignInSuccess,
          status: 200,
        });
      } else {
        // Send error response
        next(new ErrorResponse(invalidCredentials, 401));
      }
    } else {
      // Send error response
      next(new ErrorResponse(invalidCredentials, 401));
    }
  } else {
    // Send error response
    next(new ErrorResponse(invalidFormat, 400));
  }
});

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
  signIn,
  changePassword,
  updateSchoolAdminProfile,
};
