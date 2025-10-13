const { asyncHandler } = require("@MEMiddleware/async");
const {
  USER_TYPES,
  USER_STATUS,
  ACCOUNT_VERIFICATION_STATUS,
  HTTP_STATUS_CODES,
  OTP_STATUS,
  OTP_VERIFICATION_TYPES,
} = require("@MEHelpers/enums");
const {
  maskEmail,
  maskPhoneNumber,
  maskUsername,
} = require("@MEHelpers/maskingValue");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEHelpers/responseMessage");

/**
 * @desc    Sign in user
 * @route   POST /student/signin
 * @access  Student/Parent
 */
const signIn = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate request body
  if (username && password) {
    // Find user by username
    const user = await User.findOne({
      username: username,
      is_active: USER_STATUS.ACTIVE,
      is_account_verified: ACCOUNT_VERIFICATION_STATUS.VERIFIED,
      user_type: USER_TYPES.STUDENT,
    }).select("+password -reset_password_token -created_at -updated_at -__v");

    if (user) {
      // Compare password
      const isPasswordMatch = await user.matchPassword(password);

      if (isPasswordMatch) {
        // Generate JWT Token
        let token = user.getSignedJwtToken();
        user._doc.token = token;

        // Remove user_type and password from response
        delete user._doc.user_type;
        delete user._doc.password;

        // Send response
        res.status(HTTP_STATUS_CODES.STATUS_200).json({
          data: [user],
          message: responseMessage.studentSignInSuccess,
          status: HTTP_STATUS_CODES.STATUS_200,
        });
      } else {
        // Send error response
        next(
          new ErrorResponse(
            responseMessage.invalidCredentials,
            HTTP_STATUS_CODES.STATUS_401
          )
        );
      }
    } else {
      // Send error response
      next(
        new ErrorResponse(
          responseMessage.invalidCredentials,
          HTTP_STATUS_CODES.STATUS_401
        )
      );
    }
  } else {
    // Send error response
    next(
      new ErrorResponse(
        responseMessage.invalidFormat,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }
});

/**
 * @desc    Sign up student
 * @route   POST /student/signup
 * @access  Student/Parent
 */
const signUp = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  if (user) {
    delete user._doc.password;
    delete user._doc.user_type;
    delete user._doc.reset_password_token;
    delete user._doc.is_active;
    delete user._doc.updated_at;
    delete user._doc.__v;
    res.status(HTTP_STATUS_CODES.STATUS_201).json({
      data: [user],
      message: responseMessage.studentSignUpSuccess,
      status: HTTP_STATUS_CODES.STATUS_201,
    });
  } else {
    next(
      new ErrorResponse(
        responseMessage.serverError,
        HTTP_STATUS_CODES.STATUS_401
      )
    );
  }
});

const changePassword = asyncHandler(async (req, res, next) => {
  const userResetPasswordData = await User.findOne({
    _id: req.body.user_id,
    reset_password_token: req.body.reset_password_token,
  });

  if (!userResetPasswordData) {
    return next(
      new ErrorResponse(
        responseMessage.invalidCredentials,
        HTTP_STATUS_CODES.STATUS_401
      )
    );
  } else {
    const user = await User.findByIdAndUpdate(
      req.body.user_id,
      { password: req.body.password, reset_password_token: "" },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(
        new ErrorResponse(
          responseMessage.invalidCredentials,
          HTTP_STATUS_CODES.STATUS_401
        )
      );
    } else {
      res.status(HTTP_STATUS_CODES.STATUS_200).json({
        data: [],
        message: responseMessage.studentChangePasswordSuccess,
        status: HTTP_STATUS_CODES.STATUS_200,
      });
    }
  }
});

// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   const { user_id, reset_password_token, password } = req.body;

//   const user = await User.findOneAndUpdate(
//     {
//       _id: user_id,
//       reset_password_token: reset_password_token,
//       is_active: true,
//       is_account_verified: true,
//       user_type: "STUDENT",
//     },
//     { password: password, reset_password_token: "" },
//     { new: true, runValidators: true }
//   ).select(
//     "-password -is_active -is_account_verified -user_type -username -reset_password_token -created_at -updated_at -__v"
//   );

//   if (!user) {
//     next(
//       new ErrorResponse(
//         responseMessage.forgottenPasswordResetPasswordError,
//         400
//       )
//     );
//   } else {
//     res.status(200).json({
//       data: [],
//       message: responseMessage.forgottenPasswordResetPasswordSuccess,
//       status: 200,
//     });
//   }
// });

const forgottenPasswordFindUserAccount = asyncHandler(
  async (req, res, next) => {
    const { account_name } = req.body;

    if (!account_name) {
      next(
        new ErrorResponse(
          responseMessage.accountDetailsRequired,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    } else {
      const users = await User.find({
        $or: [
          { email: account_name },
          { phone_number: account_name },
          { username: account_name },
        ],
        is_active: true,
        is_account_verified: true,
        user_type: USER_TYPES.STUDENT,
      }).select(
        "-password -is_active -is_account_verified -user_type -reset_password_token -created_at -updated_at -__v"
      );

      if (users.length === 0) {
        res.status(HTTP_STATUS_CODES.STATUS_200).json({
          data: [],
          message: responseMessage.forgottenPasswordFindUserAccountError,
          status: HTTP_STATUS_CODES.STATUS_200,
        });
      } else {
        const maskedUsers = users.map((user) => ({
          ...user.toObject(),
          email: user.email ? maskEmail(user.email) : "",
          phone_number: user.phone_number
            ? maskPhoneNumber(user.phone_number)
            : "",
          username: user.username ? maskUsername(user.username) : "",
        }));

        res.status(HTTP_STATUS_CODES.STATUS_200).json({
          data: maskedUsers,
          message: responseMessage.forgottenPasswordFindUserAccountSuccess,
          status: HTTP_STATUS_CODES.STATUS_200,
        });
      }
    }
  }
);

module.exports = {
  signUp,
  signIn,
  changePassword,
  forgottenPasswordFindUserAccount,
};
