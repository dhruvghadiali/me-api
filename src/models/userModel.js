const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage/validationMessage");
const validationConst = require("@MEHelpers/validationConst/validationConst");

const { emailRegex, phoneRegex } = require("@MEHelpers/regex");

const { Schema } = mongoose;

const userSchema = Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, validationMessage.firstNameRequired],
      maxlength: [
        validationConst.firstNameMaxLength,
        validationMessage.firstNameMaxLength,
      ],
      minlength: [
        validationConst.firstNameMinLength,
        validationMessage.firstNameMinLength,
      ],
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, validationMessage.lastNameRequired],
      maxlength: [
        validationConst.lastNameMaxLength,
        validationMessage.lastNameMaxLength,
      ],
      minlength: [
        validationConst.lastNameMinLength,
        validationMessage.lastNameMinLength,
      ],
    },
    email: {
      type: String,
      trim: true,
      required: [true, validationMessage.emailRequired],
      maxlength: [
        validationConst.emailMaxLength,
        validationMessage.emailMaxLength,
      ],
      minlength: [
        validationConst.emailMinLength,
        validationMessage.emailMinLength,
      ],
      match: [emailRegex, validationMessage.emailInvalid],
    },
    phone_number: {
      type: String,
      trim: true,
      required: [true, validationMessage.phoneNumberRequired],
      maxlength: [
        validationConst.phoneNumberLength,
        validationMessage.phoneNumberMaxLength,
      ],
      minlength: [
        validationConst.phoneNumberLength,
        validationMessage.phoneNumberMinLength,
      ],
      match: [phoneRegex, validationMessage.phoneNumberInvalid],
    },
    username: {
      type: String,
      trim: true,
      index: { unique: true },
      required: [true, validationMessage.usernameRequired],
      maxlength: [
        validationConst.usernameMaxLength,
        validationMessage.usernameMaxLength,
      ],
      minlength: [
        validationConst.usernameMinLength,
        validationMessage.usernameMinLength,
      ],
    },
    password: {
      type: String,
      required: [true, validationMessage.passwordRequired],
      maxlength: [
        validationConst.passwordMaxLengthWithEncryption,
        validationMessage.passwordMaxLength,
      ],
      minlength: [
        validationConst.passwordMinLength,
        validationMessage.passwordMinLength,
      ],
      select: false,
    },
    user_type: {
      type: String,
      enum: ["SUPER_ADMIN", "SCHOOL_ADMIN", "STUDENT"],
      default: "STUDENT",
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    is_account_verified: {
      type: Boolean,
      default: false,
    },
    reset_password_token: {
      type: String,
      trim: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.pre("save", async function (next) {
  let now = moment.utc(moment());
  const salt = await bcrypt.genSalt(10);

  this.updated_at = now;
  this.created_at = now;
  this.is_active = false;
  this.is_account_verified = false;
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update && this._update.password) {
    const salt = await bcrypt.genSalt(10);
    this._update.password = await bcrypt.hash(this._update.password, salt);
  }
  next();
});

userSchema.methods.getSignedJwtToken = function () {
  let expiresIn = "60000";
  if (this.user_type === "SUPER_ADMIN") {
    expiresIn = process.env.SUPER_ADMIN_JWT_EXPIRE_TIME || "1h";
  }
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("user", userSchema);
