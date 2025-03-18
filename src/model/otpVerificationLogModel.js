const moment = require("moment");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const validationMessage = require("../helpers/validationMessage");

const { Schema } = mongoose;

const otpVerificationLog = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.userIdRequired],
      ref: 'user'
    },
    verification_token: {
      type: String,
      trim: true,
      required: [true, validationMessage.verificationTokenRequired],
      maxlength: [200, validationMessage.verificationMaxLength],
      minlength: [20, validationMessage.verificationMinLength],
    },
    email_otp: {
      type: Number,
      required: [true, validationMessage.emailOTPRequired],
      max: [999999, validationMessage.emailOTPMaxLength],
      min: [100000, validationMessage.emailOTPMinLength],
    },
    phone_otp: {
      type: Number,
      required: [true, validationMessage.phoneOTPRequired],
      max: [999999, validationMessage.phoneOTPMaxLength],
      min: [100000, validationMessage.phoneOTPMinLength],
    },
    verification_type: {
      type: String,
      enum: ["FP", "SU"],
      default: "SU",
    },
    otp_expire_time:{
      type: Date,
      required: [true, validationMessage.otpExpiryDateTimeRequired],
    },
    is_otp_verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

otpVerificationLog.pre("save", async function (next) {
  let now = moment.utc(moment());
  const salt = await bcrypt.genSalt(10);

  this.updated_at = now;
  this.created_at = now;
  this.is_otp_verified = false;
  this.verification_token = await bcrypt.hash(this.verification_token, salt);
  next();
});

otpVerificationLog.set("toJSON", { virtuals: true });

module.exports = mongoose.model("otp_verification_log", otpVerificationLog);
