const moment = require("moment");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const {
  otpMaxNumber,
  otpMinNumber,
  verificationTokenMaxChar,
  verificationTokenMinChar,
} = require("@MEHelpers/validationConst/validationConst");
const {
  userIdRequired,
  emailOTPRequired,
  emailOTPMaxLength,
  emailOTPMinLength,
  phoneOTPRequired,
  phoneOTPMaxLength,
  phoneOTPMinLength,
  verificationMaxLength,
  verificationMinLength,
  verificationTokenRequired,
  otpExpiryDateTimeRequired,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const otpVerificationLog = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, userIdRequired],
      ref: "user",
    },
    verification_token: {
      type: String,
      trim: true,
      required: [true, verificationTokenRequired],
      maxlength: [verificationTokenMaxChar, verificationMaxLength],
      minlength: [verificationTokenMinChar, verificationMinLength],
    },
    email_otp: {
      type: Number,
      required: [true, emailOTPRequired],
      max: [otpMaxNumber, emailOTPMaxLength],
      min: [otpMinNumber, emailOTPMinLength],
    },
    phone_otp: {
      type: Number,
      required: [true, phoneOTPRequired],
      max: [otpMaxNumber, phoneOTPMaxLength],
      min: [otpMinNumber, phoneOTPMinLength],
    },
    verification_type: {
      type: String,
      enum: ["FP", "SU"],
      default: "SU",
    },
    otp_expire_time: {
      type: Date,
      required: [true, otpExpiryDateTimeRequired],
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
