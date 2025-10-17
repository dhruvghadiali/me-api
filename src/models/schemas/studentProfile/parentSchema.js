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
  addressMaxLength,
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

const addressSchema = require("./addressSchema");

const { Schema } = mongoose;

const parentSchema = new Schema(
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
    occupation: { type: String, trim: true, lowercase: true },
    education: { type: String, trim: true, lowercase: true },
    annual_income: { type: Number },
    alive: { type: Boolean, default: true },
    same_address_as_student: { type: Boolean, default: true },
    address_override: { type: addressSchema, required: false },
  },
  { _id: false }
);

module.exports = parentSchema;
