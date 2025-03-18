const { asyncHandler } = require("../../middleware/async");

const User = require("../../model/userModel");
const ErrorResponse = require("../../utils/errorResponse");
const responseMessage = require("../../utils/responseMessage");
const otpVerificationLog = require("../../model/otpVerificationLogModel");

exports.signupSendOtp = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ _id: req.body.user_id });

  console.log("user", user);
  if (user) {
    let data = {
      user: req.body.user_id,
      verification_token: "sssss",
      email_otp: 123456,
      phone_otp: 123456,
      verification_type: "SU",
      otp_expire_time: Date.now(),
    };

    const otpVerificationLogDetail = await otpVerificationLog.create(data);

    console.log("otpVerificationLog", otpVerificationLogDetail);
    res.status(200).json({
      data: [otpVerificationLog],
      message: "Student signin controller",
    });
  } else {
    next(new ErrorResponse(responseMessage.invalidFormat, 400));
  }
});

exports.signupOtpVerification = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "Student signin controller",
  });
});

exports.forgottenPasswordSendOtp = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "Student signin controller",
  });
});

exports.forgottenPasswordOtpVerification = asyncHandler(
  async (req, res, next) => {
    res.status(200).json({
      data: [],
      message: "Student signin controller",
    });
  }
);
