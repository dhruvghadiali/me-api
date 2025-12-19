const mongoose = require("mongoose");

const { emailRegex, phoneRegex } = require("@MEHelpers/regex");

const {
  emailMaxChar,
  emailMinChar,
  lastNameMaxChar,
  lastNameMinChar,
  phoneNumberChar,
  firstNameMaxChar,
  firstNameMinChar,
  aadhaarNumberChar,
} = require("@MEHelpers/validationConst");

const {
  emailInvalid,
  emailMaxLength,
  emailMinLength,
  lastNameRequired,
  lastNameMaxLength,
  lastNameMinLength,
  firstNameRequired,
  firstNameMaxLength,
  firstNameMinLength,
  phoneNumberInvalid,
  phoneNumberRequired,
  phoneNumberMaxLength,
  phoneNumberMinLength,
  aadhaarNumberMaxLength,
  aadhaarNumberMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;
const {
  PARENT_OCCUPATIONS_IN,
  EDUCATION_LEVELS_IN,
} = require("@ME/helpers/enums/studentEnums");

const parentProfileSchema = new Schema(
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
    phone_number: {
      type: String,
      trim: true,
      required: [true, phoneNumberRequired],
      maxlength: [phoneNumberChar, phoneNumberMaxLength],
      minlength: [phoneNumberChar, phoneNumberMinLength],
      match: [phoneRegex, phoneNumberInvalid],
    },
    email: {
      type: String,
      trim: true,
      maxlength: [emailMaxChar, emailMaxLength],
      minlength: [emailMinChar, emailMinLength],
      match: [emailRegex, emailInvalid],
    },
    aadhaar_number: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [aadhaarNumberChar, aadhaarNumberMaxLength],
      minlength: [aadhaarNumberChar, aadhaarNumberMinLength],
    },
    occupation: {
      type: String,
      trim: true,
      lowercase: true,
      enum: Object.values(PARENT_OCCUPATIONS_IN),
    },
    education: {
      type: String,
      trim: true,
      lowercase: true,
      enum: Object.values(EDUCATION_LEVELS_IN),
    },
    annual_income: { type: Number },
    alive: { type: Boolean, default: true },
    same_address_as_student: { type: Boolean, default: true },
    address_override: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("parent_profile", parentProfileSchema);
