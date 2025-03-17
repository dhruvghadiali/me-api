const { asyncHandler } = require("../../middleware/async");

exports.signupSendOtp = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "Student signin controller",
  });
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
