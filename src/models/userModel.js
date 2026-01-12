const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const {
  USER_TYPES,
  USER_STATUS,
  ACCOUNT_VERIFICATION_STATUS,
} = require("@MEHelpers/enums");
const { emailRegex, phoneRegex } = require("@MEHelpers/regex");
const {
  emailMaxChar,
  emailMinChar,
  passwordMinChar,
  phoneNumberChar,
  usernameMaxChar,
  usernameMinChar,
  lastNameMaxChar,
  lastNameMinChar,
  firstNameMaxChar,
  firstNameMinChar,
  passwordMaxCharWithEncryption,
} = require("@MEHelpers/validationConst");

const {
  emailInvalid,
  emailRequired,
  emailMaxLength,
  emailMinLength,
  passwordRequired,
  usernameRequired,
  lastNameRequired,
  passwordMinLength,
  usernameMaxLength,
  usernameMinLength,
  lastNameMaxLength,
  lastNameMinLength,
  firstNameRequired,
  firstNameMaxLength,
  firstNameMinLength,
  phoneNumberInvalid,
  phoneNumberRequired,
  phoneNumberMaxLength,
  phoneNumberMinLength,
  passwordMaxLengthWithEncryption,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const userSchema = Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, firstNameRequired],
      maxlength: [firstNameMaxChar, firstNameMaxLength],
      minlength: [firstNameMinChar, firstNameMinLength],
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, lastNameRequired],
      maxlength: [lastNameMaxChar, lastNameMaxLength],
      minlength: [lastNameMinChar, lastNameMinLength],
    },
    email: {
      type: String,
      trim: true,
      required: [true, emailRequired],
      maxlength: [emailMaxChar, emailMaxLength],
      minlength: [emailMinChar, emailMinLength],
      match: [emailRegex, emailInvalid],
    },
    phone_number: {
      type: String,
      trim: true,
      required: [true, phoneNumberRequired],
      maxlength: [phoneNumberChar, phoneNumberMaxLength],
      minlength: [phoneNumberChar, phoneNumberMinLength],
      match: [phoneRegex, phoneNumberInvalid],
    },
    username: {
      type: String,
      trim: true,
      index: { unique: true },
      required: [true, usernameRequired],
      maxlength: [usernameMaxChar, usernameMaxLength],
      minlength: [usernameMinChar, usernameMinLength],
    },
    password: {
      type: String,
      required: [true, passwordRequired],
      maxlength: [
        passwordMaxCharWithEncryption,
        passwordMaxLengthWithEncryption,
      ],
      minlength: [passwordMinChar, passwordMinLength],
      select: false,
    },
    user_type: {
      type: String,
      enum: [
        USER_TYPES.SUPER_ADMIN,
        USER_TYPES.SCHOOL_ADMIN,
        USER_TYPES.STUDENT,
      ],
      default: USER_TYPES.STUDENT,
    },
    is_active: {
      type: Boolean,
      default: USER_STATUS.INACTIVE,
    },
    is_account_verified: {
      type: Boolean,
      default: ACCOUNT_VERIFICATION_STATUS.UNVERIFIED,
    },
    reset_password_token: {
      type: String,
      trim: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);

  this.is_active = USER_STATUS.INACTIVE;
  this.is_account_verified = ACCOUNT_VERIFICATION_STATUS.UNVERIFIED;
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
  let expiresIn = "1m";
  if (this.user_type === USER_TYPES.SUPER_ADMIN) {
    expiresIn = process.env.SUPER_ADMIN_JWT_EXPIRE_TIME || expiresIn;
  } else if (this.user_type === USER_TYPES.SCHOOL_ADMIN) {
    expiresIn = process.env.SCHOOL_ADMIN_JWT_EXPIRE_TIME || expiresIn;
  } else if (this.user_type === USER_TYPES.STUDENT) {
    expiresIn = process.env.STUDENT_JWT_EXPIRE_TIME || expiresIn;
  }
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

userSchema.statics.setSchoolAdminDefaultPassword = async function () {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash("123456789", salt);
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.generateResetPasswordToken = async function (userId) {
  const saltRounds = await bcrypt.genSalt(10);
  return await bcrypt.hash(userId, saltRounds);
};

userSchema.virtual("school_address", {
  ref: "school_address",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

userSchema.virtual("student_profile", {
  ref: "student_profile",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

userSchema.virtual("parent_profile", {
  ref: "parent_profile",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("sibling_profile", {
  ref: "sibling_profile",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("address", {
  ref: "address",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("emergency_contact", {
  ref: "emergency_contact",
  localField: "_id",
  foreignField: "user",
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("user", userSchema);
