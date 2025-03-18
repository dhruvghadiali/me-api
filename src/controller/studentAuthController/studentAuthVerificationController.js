const moment = require("moment");

const { sendOTP } = require("../../helpers/email");
const { asyncHandler } = require("../../middleware/async");

const User = require("../../model/userModel");
const ErrorResponse = require("../../utils/errorResponse");
const responseMessage = require("../../utils/responseMessage");
const otpVerificationLog = require("../../model/otpVerificationLogModel");

exports.signupSendOtp = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ _id: req.body.user_id, is_active: false });

  if (user) {
    let data = {
      user: req.body.user_id,
      verification_token: `${req.body.user_id}-${moment().format(
        "DDMMYYYYHHMMA"
      )}`,
      email_otp: Math.floor(100000 + Math.random() * 900000),
      phone_otp: Math.floor(100000 + Math.random() * 900000),
      verification_type: "SU",
      otp_expire_time: moment().add(15, "minute"),
    };

    const otpVerificationLogDetail = await otpVerificationLog.create(data);

    if (otpVerificationLogDetail) {
      delete otpVerificationLogDetail._doc.__v;
      delete otpVerificationLogDetail._doc.user;
      delete otpVerificationLogDetail._doc.email_otp;
      delete otpVerificationLogDetail._doc.phone_otp;
      delete otpVerificationLogDetail._doc.updated_at;
      delete otpVerificationLogDetail._doc.created_at;
      delete otpVerificationLogDetail._doc.is_otp_verified;
      delete otpVerificationLogDetail._doc.otp_expire_time;
      delete otpVerificationLogDetail._doc.verification_type;

      /**
       * TODO: Send OTP to register email address.
       */
      await sendOTP({
        toEmail: "dhruvghadiali21@gmail.com", // user.email,
        otp: data.email_otp,
      });

      res.status(200).json({
        data: [otpVerificationLogDetail],
        message: responseMessage.studentSignUpSuccess,
        status: 200,
      });
    } else {
      next(new ErrorResponse(responseMessage.serverError, 401));
    }
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
