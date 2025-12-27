const mongoose = require("mongoose");

const { Schema } = mongoose;

const { emailRegex, phoneRegex } = require("@MEHelpers/regex");
const {
  EMERGENCY_CONTACT_RELATIONS,
} = require("@ME/helpers/enums/studentEnums");
const {
  emailMaxChar,
  emailMinChar,
  phoneNumberChar,
  emergencyContactNameMinChar,
  emergencyContactNameMaxChar,
} = require("@MEHelpers/validationConst");
const {
  emailInvalid,
  emailMaxLength,
  emailMinLength,
  phoneNumberInvalid,
  phoneNumberRequired,
  phoneNumberMaxLength,
  phoneNumberMinLength,
  emergencyContactNameRequired,
  emergencyContactNameMinLength,
  emergencyContactNameMaxLength,
  emergencyContactRelationRequired,
  emergencyContactRelationInvalid,
} = require("@MEHelpers/validationMessage");

const emergencyContactSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, emergencyContactNameRequired],
      minlength: [emergencyContactNameMinChar, emergencyContactNameMinLength],
      maxlength: [emergencyContactNameMaxChar, emergencyContactNameMaxLength],
    },
    relation: {
      type: String,
      trim: true,
      required: [true, emergencyContactRelationRequired],
      lowercase: true,
      enum: {
        values: Object.values(EMERGENCY_CONTACT_RELATIONS),
        message: emergencyContactRelationInvalid,
      },
    },
    phone_number: {
      type: String,
      trim: true,
      required: [true, phoneNumberRequired],
      maxlength: [phoneNumberChar, phoneNumberMaxLength],
      minlength: [phoneNumberChar, phoneNumberMinLength],
      match: [phoneRegex, phoneNumberInvalid],
    },
    alternate_phone: {
      type: String,
      trim: true,
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
    address: { type: String, trim: true, lowercase: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("emergency_contact", emergencyContactSchema);
