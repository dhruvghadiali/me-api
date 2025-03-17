const moment = require("moment");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const validationMessage = require("../helpers/validationMessage");

const { Schema } = mongoose;

const userSchema = Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, validationMessage.firstNameRequired],
      maxlength: [25, validationMessage.firstNameMaxLength],
      minlength: [5, validationMessage.firstNameMinLength],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, validationMessage.lastNameRequired],
      maxlength: [25, validationMessage.lastNameMaxLength],
      minlength: [5, validationMessage.lastNameMinLength],
    },
    email: {
      type: String,
      trim: true,
      required: [true, validationMessage.emailRequired],
      maxlength: [100, validationMessage.emailMaxLength],
      minlength: [5, validationMessage.emailMinLength],
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        validationMessage.emailInvalid,
      ],
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: [true, validationMessage.phoneNumberRequired],
      maxlength: [10, validationMessage.phoneNumberMaxLength],
      minlength: [10, validationMessage.phoneNumberMinLength],
      match: [
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        validationMessage.phoneNumberInvalid,
      ],
    },
    username: {
      type: String,
      trim: true,
      index: { unique: true },
      required: [true, validationMessage.usernameRequired],
      maxlength: [25, validationMessage.usernameMaxLength],
      minlength: [5, validationMessage.usernameMinLength],
    },
    password: {
      type: String,
      required: [true, validationMessage.passwordRequired],
      maxlength: [200, validationMessage.passwordMaxLength],
      minlength: [5, validationMessage.passwordMinLength],
      select: false,
    },
    user_type: {
      type: String,
      enum: ["SUPER_ADMIN", "SCHOOL_ADMIN", "STUDENT"],
      default: "STUDENT",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    is_active: {
      type: Boolean,
      default: false,
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
    expiresIn = process.env.SUPER_ADMIN_JWT_EXPIRE_TIME;
  }
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.methods.matchPassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

module.exports = mongoose.model("user", userSchema);
