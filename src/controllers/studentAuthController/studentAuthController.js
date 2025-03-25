const { asyncHandler } = require("@MEMiddleware/async");
const {
  maskEmail,
  maskPhoneNumber,
  maskUsername,
} = require("@MEHelpers/maskingValue");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEUtils/responseMessage");

exports.signIn = asyncHandler(async (req, res, next) => {
  if (req.body.username && req.body.password) {
    const user = await User.findOne({
      username: req.body.username,
      is_active: true,
      user_type: "STUDENT",
    }).select(
      "+password -is_active -reset_password_token -created_at -updated_at -__v"
    );

    if (user) {
      const isPasswordMatch = await user.matchPassword(req.body.password);

      if (isPasswordMatch) {
        let token = user.getSignedJwtToken();
        user._doc.token = token;
        delete user._doc.user_type;
        delete user._doc.password;

        res.status(200).json({
          data: [user],
          message: responseMessage.studentSignInSuccess,
          status: 200,
        });
      } else {
        next(new ErrorResponse(responseMessage.invalidCredentials, 401));
      }
    } else {
      next(new ErrorResponse(responseMessage.invalidCredentials, 401));
    }
  } else {
    next(new ErrorResponse(responseMessage.invalidFormat, 400));
  }
});

exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  if (user) {
    delete user._doc.password;
    delete user._doc.user_type;
    delete user._doc.reset_password_token;
    delete user._doc.is_active;
    delete user._doc.updated_at;
    delete user._doc.__v;
    res.status(201).json({
      data: [user],
      message: responseMessage.studentSignUpSuccess,
      status: 201,
    });
  } else {
    next(new ErrorResponse(responseMessage.serverError, 401));
  }
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "Student change password controller",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { user_id, reset_password_token, password } = req.body;
  
  const user = await User.findOneAndUpdate(
    {
      _id: user_id,
      reset_password_token: reset_password_token,
      is_active: true,
      is_account_verified: true,
      user_type: "STUDENT",
    },
    { password: password, reset_password_token: "" },
    { new: true, runValidators: true }
  ).select(
    "-password -is_active -is_account_verified -user_type -username -reset_password_token -created_at -updated_at -__v"
  );

  if (!user) {
    next(
      new ErrorResponse(
        responseMessage.forgottenPasswordResetPasswordError,
        400
      )
    );
  } else {
    res.status(200).json({
      data: [],
      message: responseMessage.forgottenPasswordResetPasswordSuccess,
      status:200
    });
  }
});

exports.forgottenPasswordFindUserAccount = asyncHandler(
  async (req, res, next) => {
    const { account_name } = req.body;

    if (!account_name) {
      next(new ErrorResponse(responseMessage.accountDetailsRequired, 400));
    } else {
      const users = await User.find({
        $or: [
          { email: account_name },
          { phone_number: account_name },
          { username: account_name },
        ],
        is_active: true,
        is_account_verified: true,
        user_type: "STUDENT",
      }).select(
        "-password -is_active -is_account_verified -user_type -reset_password_token -created_at -updated_at -__v"
      );

      if (users.length === 0) {
        res.status(200).json({
          data: [],
          message: responseMessage.forgottenPasswordFindUserAccountError,
          status: 200,
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

        res.status(200).json({
          data: maskedUsers,
          message: responseMessage.forgottenPasswordFindUserAccountSuccess,
          status: 200,
        });
      }
    }
  }
);
