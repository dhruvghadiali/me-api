const { asyncHandler } = require("../../middleware/async");

const User = require("../../model/userModel");
const ErrorResponse = require("../../utils/errorResponse");
const responseMessage = require("../../utils/responseMessage");

exports.signin = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "Student signin controller",
  });
});

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  if (user) {
    delete user._doc.password;
    delete user._doc.user_type;
    delete user._doc.is_active;
    delete user._doc.updated_at;
    delete user._doc.__v;
    res.status(201).json({
      data: [user],
      message: responseMessage.studentSignupSuccess,
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
  res.status(200).json({
    data: [],
    message: "Student reset password controller",
  });
});

exports.forgottenPasswordFindUserAccount = asyncHandler(
  async (req, res, next) => {
    res.status(200).json({
      data: [],
      message: "Student forgotten password find user account controller",
    });
  }
);
