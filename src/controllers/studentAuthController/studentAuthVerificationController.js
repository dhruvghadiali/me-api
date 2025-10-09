const moment = require("moment");
const bcrypt = require("bcryptjs");

const { sendEmailOTP } = require("@MEHelpers/email");
const { sendSMSOTP } = require("@MEHelpers/sms");
const { asyncHandler } = require("@MEMiddleware/async");
const {
  USER_TYPES,
  USER_STATUS,
  ACCOUNT_VERIFICATION_STATUS,
  HTTP_STATUS_CODES,
  OTP_VERIFICATION_TYPES,
  OTP_STATUS,
  OTP_CONFIG,
} = require("@MEHelpers/enums");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEHelpers/responseMessage");
const otpVerificationLog = require("@MEModels/otpVerificationLogModel");

/**
 * Common function to send OTP for different verification types
 * @param {string} userId - User ID
 * @param {string} verificationType - Type of verification (SU for SignUp, FP for Forgot Password)
 * @param {Object} userQuery - Query object to find user
 * @returns {Object} OTP verification log details
 */
const sendOTPCommon = async (userId, verificationType, userQuery = {}) => {
  // Find user with provided query conditions
  const user = await User.findOne({
    _id: userId,
    user_type: USER_TYPES.STUDENT,
    ...userQuery,
  });

  if (!user) {
    throw new ErrorResponse(
      responseMessage.invalidFormat,
      HTTP_STATUS_CODES.STATUS_400
    );
  }

  // Generate OTP
  const emailOtp = Math.floor(
    OTP_CONFIG.MIN_VALUE +
      Math.random() * (OTP_CONFIG.MAX_VALUE - OTP_CONFIG.MIN_VALUE)
  );
  const phoneOtp =
    verificationType === OTP_VERIFICATION_TYPES.FORGOT_PASSWORD
      ? emailOtp // Same OTP for forgot password
      : Math.floor(
          OTP_CONFIG.MIN_VALUE +
            Math.random() * (OTP_CONFIG.MAX_VALUE - OTP_CONFIG.MIN_VALUE)
        );

  // Prepare OTP verification data
  const data = {
    user: userId,
    verification_token: `${userId}-${moment().format("DDMMYYYYHHMMA")}`,
    email_otp: emailOtp,
    phone_otp: phoneOtp,
    verification_type: verificationType,
    otp_expire_time: moment().add(OTP_CONFIG.EXPIRE_MINUTES, "minute"),
  };

  // Create OTP verification log
  const otpVerificationLogDetail = await otpVerificationLog.create(data);

  if (!otpVerificationLogDetail) {
    throw new ErrorResponse(
      responseMessage.serverError,
      HTTP_STATUS_CODES.STATUS_503
    );
  }

  // Clean up response data
  delete otpVerificationLogDetail._doc.__v;
  delete otpVerificationLogDetail._doc.user;
  delete otpVerificationLogDetail._doc.email_otp;
  delete otpVerificationLogDetail._doc.phone_otp;
  delete otpVerificationLogDetail._doc.updated_at;
  delete otpVerificationLogDetail._doc.created_at;
  delete otpVerificationLogDetail._doc.is_otp_verified;
  delete otpVerificationLogDetail._doc.otp_expire_time;
  delete otpVerificationLogDetail._doc.verification_type;

  // Send OTP via email
  await sendEmailOTP({
    toEmail: "dhruvghadiali21@gmail.com", // user.email,
    otp: data.email_otp,
  });

  // Send OTP via SMS
  await sendSMSOTP({
    toPhoneNumber: "+917405111564", // `+91${user.phone_number}`,
    otp: data.phone_otp,
  });

  return otpVerificationLogDetail;
};

const signUpSendOTP = asyncHandler(async (req, res, next) => {
  try {
    const otpVerificationLogDetail = await sendOTPCommon(
      req.body.user_id,
      OTP_VERIFICATION_TYPES.SIGN_UP
    );

    res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [otpVerificationLogDetail],
      message: responseMessage.otpSendSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  } catch (error) {
    next(
      new ErrorResponse(
        responseMessage.serverError,
        HTTP_STATUS_CODES.STATUS_500
      )
    );
  }
});

const signUpOTPVerification = asyncHandler(async (req, res, next) => {
  const otpVerificationData = await otpVerificationLog.findOne({
    user: req.body.user_id,
    verification_token: req.body.verification_token,
    is_otp_verified: OTP_STATUS.UNVERIFIED,
    verification_type: OTP_VERIFICATION_TYPES.SIGN_UP,
  });

  if (!otpVerificationData) {
    next(
      new ErrorResponse(
        responseMessage.invalidFormat,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  } else {
    if (otpVerificationData.email_otp !== req.body.email_otp) {
      next(
        new ErrorResponse(
          responseMessage.emailOTPInvalid,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    } else {
      if (otpVerificationData.phone_otp !== req.body.phone_otp) {
        next(
          new ErrorResponse(
            responseMessage.phoneOTPInvalid,
            HTTP_STATUS_CODES.STATUS_400
          )
        );
      } else {
        if (moment().isAfter(otpVerificationData.otp_expire_time)) {
          next(
            new ErrorResponse(
              responseMessage.otpVerificationTimeExpire,
              HTTP_STATUS_CODES.STATUS_400
            )
          );
        } else {
          const updateOTPVerificationStatusResponse =
            await otpVerificationLog.findByIdAndUpdate(
              otpVerificationData.id,
              { is_otp_verified: OTP_STATUS.VERIFIED },
              {
                new: true,
                runValidators: true,
              }
            );

          const updateUserStatusResponse = await User.findByIdAndUpdate(
            req.body.user_id,
            {
              is_active: USER_STATUS.ACTIVE,
              is_account_verified: ACCOUNT_VERIFICATION_STATUS.VERIFIED,
            },
            {
              new: true,
              runValidators: true,
            }
          );

          if (updateOTPVerificationStatusResponse && updateUserStatusResponse) {
            res.status(HTTP_STATUS_CODES.STATUS_200).json({
              data: [],
              message: responseMessage.signUpOTPVerificationSuccess,
              status: HTTP_STATUS_CODES.STATUS_200,
            });
          } else {
            next(
              new ErrorResponse(
                responseMessage.signUpOTPVerificationError,
                HTTP_STATUS_CODES.STATUS_400
              )
            );
          }
        }
      }
    }
  }
});

const forgottenPasswordSendOTP = asyncHandler(async (req, res, next) => {
  try {
    const otpVerificationLogDetail = await sendOTPCommon(
      req.body.user_id,
      OTP_VERIFICATION_TYPES.FORGOT_PASSWORD,
      {
        is_active: USER_STATUS.ACTIVE,
        is_account_verified: ACCOUNT_VERIFICATION_STATUS.VERIFIED,
      }
    );

    res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [otpVerificationLogDetail],
      message: responseMessage.otpSendSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  } catch (error) {
    next(
      new ErrorResponse(
        responseMessage.serverError,
        HTTP_STATUS_CODES.STATUS_500
      )
    );
  }
});

// exports.forgottenPasswordOTPVerification = asyncHandler(
//   async (req, res, next) => {
//     const { user_id, verification_token, otp } = req.body;

//     const otpVerificationData = await otpVerificationLog.findOne({
//       user: user_id,
//       verification_token: verification_token,
//       is_otp_verified: false,
//     });

//     if (!otpVerificationData) {
//       next(new ErrorResponse(responseMessage.invalidFormat, 400));
//     } else {
//       if (otpVerificationData.email_otp !== otp) {
//         next(new ErrorResponse(responseMessage.emailOTPInvalid, 400));
//       } else {
//         if (otpVerificationData.phone_otp !== otp) {
//           next(new ErrorResponse(responseMessage.phoneOTPInvalid, 400));
//         } else {
//           if (moment().isAfter(otpVerificationData.otp_expire_time)) {
//             next(
//               new ErrorResponse(responseMessage.otpVerificationTimeExpire, 400)
//             );
//           } else {
//             const saltRounds = await bcrypt.genSalt(10);
//             const resetPasswordToken = await bcrypt.hash(user_id, saltRounds);

//             const updateOTPVerificationStatusResponse =
//               await otpVerificationLog.findByIdAndUpdate(
//                 otpVerificationData.id,
//                 { is_otp_verified: true },
//                 {
//                   new: true,
//                   runValidators: true,
//                 }
//               );

//             const updateUserResetPasswordTokenResponse =
//               await User.findByIdAndUpdate(
//                 user_id,
//                 { reset_password_token: resetPasswordToken },
//                 {
//                   new: true,
//                   runValidators: true,
//                 }
//               ).select(
//                 "-first_name -last_name -email -phone_number -username -password -is_active -is_account_verified -user_type -created_at -updated_at -__v"
//               );

//             if (
//               updateOTPVerificationStatusResponse &&
//               updateUserResetPasswordTokenResponse
//             ) {
//               res.status(200).json({
//                 data: [updateUserResetPasswordTokenResponse],
//                 message:
//                   responseMessage.forgottenPasswordOTPVerificationSuccess,
//                 status: 200,
//               });
//             } else {
//               next(
//                 new ErrorResponse(
//                   responseMessage.forgottenPasswordOTPVerificationError,
//                   400
//                 )
//               );
//             }
//           }
//         }
//       }
//     }
//   }
// );

module.exports = {
  signUpSendOTP,
  signUpOTPVerification,
  forgottenPasswordSendOTP,
};
