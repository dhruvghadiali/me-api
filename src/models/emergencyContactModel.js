const mongoose = require("mongoose");

const { emailRegex, phoneRegex } = require("@MEHelpers/regex");

const {
  emailMaxChar,
  emailMinChar,
  phoneNumberChar,
} = require("@MEHelpers/validationConst");

const {
  emailInvalid,
  emailMaxLength,
  emailMinLength,
  phoneNumberInvalid,
  phoneNumberRequired,
  phoneNumberMaxLength,
  phoneNumberMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;
const {
  EMERGENCY_CONTACT_RELATIONS,
} = require("@ME/helpers/enums/studentEnums");

const emergencyContactSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    relation: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      enum: Object.values(EMERGENCY_CONTACT_RELATIONS),
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
