const moment = require("moment");
const bcrypt = require("bcryptjs");

const { sendEmailOTP } = require("@MEHelpers/email");
const { sendSMSOTP } = require("@MEHelpers/sms");
const { asyncHandler } = require("@MEMiddleware/async");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEHelpers/responseMessage");
const otpVerificationLog = require("@MEModels/otpVerificationLogModel");

const signUpSendOTP = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.body.user_id,
    user_type: "STUDENT",
  });

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
      await sendEmailOTP({
        toEmail: "dhruvghadiali21@gmail.com", // user.email,
        otp: data.email_otp,
      });

      /**
       * TODO: Send OTP to register phone number. store error response in log
       */

      await sendSMSOTP({
        toPhoneNumber: "+917405111564", // `+91${user.phone_number}`,
        otp: data.phone_otp,
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

const signUpOTPVerification = asyncHandler(async (req, res, next) => {
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

// exports.forgottenPasswordSendOTP = asyncHandler(async (req, res, next) => {
//   const user = await User.findOne({
//     _id: req.body.user_id,
//     is_active: true,
//     is_account_verified: true,
//     user_type: "STUDENT",
//   });

//   if (user) {
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const data = {
//       user: req.body.user_id,
//       verification_token: `${req.body.user_id}-${moment().format(
//         "DDMMYYYYHHMMA"
//       )}`,
//       email_otp: otp,
//       phone_otp: otp,
//       verification_type: "FP",
//       otp_expire_time: moment().add(15, "minute"),
//     };

//     const otpVerificationLogDetail = await otpVerificationLog.create(data);

//     if (otpVerificationLogDetail) {
//       delete otpVerificationLogDetail._doc.__v;
//       delete otpVerificationLogDetail._doc.user;
//       delete otpVerificationLogDetail._doc.email_otp;
//       delete otpVerificationLogDetail._doc.phone_otp;
//       delete otpVerificationLogDetail._doc.updated_at;
//       delete otpVerificationLogDetail._doc.created_at;
//       delete otpVerificationLogDetail._doc.is_otp_verified;
//       delete otpVerificationLogDetail._doc.otp_expire_time;
//       delete otpVerificationLogDetail._doc.verification_type;

//       /**
//        * TODO: Send OTP to register email address. store error response in log
//        */
//       await sendOTP({
//         toEmail: "dhruvghadiali21@gmail.com", // user.email,
//         otp: data.email_otp,
//       });

//       res.status(200).json({
//         data: [otpVerificationLogDetail],
//         message: responseMessage.otpSendSuccess,
//         status: 200,
//       });
//     } else {
//       next(new ErrorResponse(responseMessage.serverError, 401));
//     }
//   } else {
//     next(new ErrorResponse(responseMessage.invalidFormat, 400));
//   }
// });

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
};
