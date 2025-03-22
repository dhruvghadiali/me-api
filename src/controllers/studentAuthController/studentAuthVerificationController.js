const moment = require("moment");

const { sendOTP } = require("@MEHelpers/email");
const { asyncHandler } = require("@MEMiddleware/async");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEUtils/responseMessage");
const otpVerificationLog = require("@MEModels/otpVerificationLogModel");

exports.signupSendOtp = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.body.user_id});

  if (user) {
    const data = {
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
       * TODO: Send OTP to register email address. store error response in log
       */
      await sendOTP({
        toEmail: "dhruvghadiali21@gmail.com", // user.email,
        otp: data.email_otp,
      });

      res.status(200).json({
        data: [otpVerificationLogDetail],
        message: responseMessage.otpSendSuccess,
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
  const otpVerificationData = await otpVerificationLog.findOne({
    user: req.body.user_id,
    verification_token: req.body.verification_token,
    is_otp_verified: false,
  });

  if (!otpVerificationData) {
    next(new ErrorResponse(responseMessage.invalidFormat, 400));
  } else {
    if (otpVerificationData.email_otp !== req.body.email_otp) {
      next(new ErrorResponse(responseMessage.emailOTPInvalid, 400));
    } else {
      if (otpVerificationData.phone_otp !== req.body.phone_otp) {
        next(new ErrorResponse(responseMessage.phoneOTPInvalid, 400));
      } else {
        if (moment().isAfter(otpVerificationData.otp_expire_time)) {
          next(
            new ErrorResponse(responseMessage.otpVerificationTimeExpire, 400)
          );
        } else {
          const updateOTPVerificationStatusResponse =
            await otpVerificationLog.findByIdAndUpdate(
              otpVerificationData.id,
              { is_otp_verified: true },
              {
                new: true,
                runValidators: true,
              }
            );

          const updateUserStatusResponse = await User.findByIdAndUpdate(
            req.body.user_id,
            { is_active: true, is_account_verified: true },
            {
              new: true,
              runValidators: true,
            }
          );

          if (updateOTPVerificationStatusResponse && updateUserStatusResponse) {
            res.status(200).json({
              data: [],
              message: responseMessage.signUpOTPVerificationSuccess,
              status: 200,
            });
          } else {
            next(
              new ErrorResponse(responseMessage.signUpOTPVerificationError, 400)
            );
          }
        }
      }
    }
  }
});

exports.forgottenPasswordSendOtp = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.body.user_id, is_active: true });

  if (user) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const data = {
      user: req.body.user_id,
      verification_token: `${req.body.user_id}-${moment().format(
        "DDMMYYYYHHMMA"
      )}`,
      email_otp: otp,
      phone_otp: otp,
      verification_type: "FP",
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
       * TODO: Send OTP to register email address. store error response in log
       */
      await sendOTP({
        toEmail: "dhruvghadiali21@gmail.com", // user.email,
        otp: data.email_otp,
      });

      res.status(200).json({
        data: [otpVerificationLogDetail],
        message: responseMessage.otpSendSuccess,
        status: 200,
      });
    } else {
      next(new ErrorResponse(responseMessage.serverError, 401));
    }
  } else {
    next(new ErrorResponse(responseMessage.invalidFormat, 400));
  }
});

exports.forgottenPasswordOtpVerification = asyncHandler(
  async (req, res, next) => {
    const otpVerificationData = await otpVerificationLog.findOne({
      user: req.body.user_id,
      verification_token: req.body.verification_token,
      is_otp_verified: false,
    });

    if (!otpVerificationData) {
      next(new ErrorResponse(responseMessage.invalidFormat, 400));
    } else {
      if (otpVerificationData.email_otp !== req.body.email_otp) {
        next(new ErrorResponse(responseMessage.emailOTPInvalid, 400));
      } else {
        if (otpVerificationData.phone_otp !== req.body.phone_otp) {
          next(new ErrorResponse(responseMessage.phoneOTPInvalid, 400));
        } else {
          if (moment().isAfter(otpVerificationData.otp_expire_time)) {
            next(
              new ErrorResponse(responseMessage.otpVerificationTimeExpire, 400)
            );
          } else {
            const updateOTPVerificationStatusResponse =
              await otpVerificationLog.findByIdAndUpdate(
                otpVerificationData.id,
                { is_otp_verified: true },
                {
                  new: true,
                  runValidators: true,
                }
              );

            if (updateOTPVerificationStatusResponse) {
              res.status(200).json({
                data: [],
                message:
                  responseMessage.forgottenPasswordOTPVerificationSuccess,
                status: 200,
              });
            } else {
              next(
                new ErrorResponse(
                  responseMessage.forgottenPasswordOTPVerificationError,
                  400
                )
              );
            }
          }
        }
      }
    }
  }
);
