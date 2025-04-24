const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  invalidFormat,
  invalidCredentials,
  superAdminSignUpError,
  superAdminSignUpDBError,
  superAdminSignUpSuccess,
  superAdminSignInSuccess,
  superAdminPasswordChangedError,
  superAdminSignUpActivationError,
  superAdminPasswordChangedSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Signin super admin
 * @route   GET /super-admin/signin
 * @access  Super Admin
 */
const signIn = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (username && password) {
    // Check username is present in DB or not with is_active and is_account_verified status value true and user_type must be super admin.
    const user = await User.findOne({
      username: username,
      is_active: true,
      is_account_verified: true,
      user_type: "SUPER_ADMIN",
    }).select(["password", "username", "user_type"]);

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
          message: superAdminSignInSuccess,
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
 * @desc    Signup new super admin
 * @route   GET /super-admin/signup
 * @access  Super Admin
 */
const signUp = asyncHandler(async (req, res, next) => {
  // Check super admin account is already present in DB or not.
  const user = await User.findOne({
    user_type: "SUPER_ADMIN",
  });

  if (user) {
    // Send error response
    next(new ErrorResponse(superAdminSignUpError, 400));
  } else {
    let data = {
      first_name: "me_super_admin",
      last_name: "me_super_admin",
      email: "me_super_admin@gmail.com",
      phone_number: "1234567890",
      username: "me_super_admin",
      password: "me@123456",
      user_type: "SUPER_ADMIN",
    };

    // Create new super admin account
    const superAdmin = await User.create(data);

    if (superAdmin) {
      // Activate super admin account by changing is_active and is_account_verified status value to true.
      const activeSuperAdmin = await User.findOneAndUpdate(
        {
          _id: superAdmin._id,
          user_type: "SUPER_ADMIN",
        },
        {
          is_active: true,
          is_account_verified: true,
        },
        { new: true, runValidators: true }
      );

      if (activeSuperAdmin) {
        // Send response
        res.status(201).json({
          data: [],
          message: superAdminSignUpSuccess,
          status: 201,
        });
      } else {
        // Send error response
        next(new ErrorResponse(superAdminSignUpActivationError, 401));
      }
    } else {
      // Send error response
      next(new ErrorResponse(superAdminSignUpDBError, 401));
    }
  }
});

/**
 * @desc    Signup new super admin
 * @route   GET /super-admin/change-password
 * @access  Super Admin
 */
const changePassword = asyncHandler(async (req, res, next) => {
  const { id, password } = req.body;

  // Update super admin password and change is_active and is_account_verified status value to true.
  const user = await User.findOneAndUpdate(
    {
      _id: id,
      user_type: "SUPER_ADMIN",
    },
    { password: password, is_active: true, is_account_verified: true },
    { new: true, runValidators: true }
  );

  if (user) {
    // Send response
    res.status(200).json({
      data: [],
      message: superAdminPasswordChangedSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(superAdminPasswordChangedError, 400));
  }
});

module.exports = {
  signIn,
  signUp,
  changePassword,
};
