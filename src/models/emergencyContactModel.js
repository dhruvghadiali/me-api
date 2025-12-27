const mongoose = require("mongoose");

const { Schema } = mongoose;

const { isActiveUserValidator } = require("@MEUtils/dbQuery");
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
  emergencyContactAddressMinChar,
  emergencyContactAddressMaxChar,
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
  usernameRequired,
  usernameInvalid,
  emergencyContactAddressMaxLength,
  emergencyContactAddressMinLength,
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
    address: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [
        emergencyContactAddressMaxChar,
        emergencyContactAddressMaxLength,
      ],
      minlength: [
        emergencyContactAddressMinChar,
        emergencyContactAddressMinLength,
      ],
    },
    is_active: { type: Boolean, default: true },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

emergencyContactSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, response) {
    if (
      _.get(response, "created_by.first_name") &&
      _.get(response, "created_by.last_name")
    ) {
      response.created_by = `${response.created_by.first_name} ${response.created_by.last_name}`;
    } else {
      delete response.created_by;
    }

    if (
      _.get(response, "updated_by.first_name") &&
      _.get(response, "updated_by.last_name")
    ) {
      response.updated_by = `${response.updated_by.first_name} ${response.updated_by.last_name}`;
    } else {
      delete response.updated_by;
    }
    return response;
  },
});
emergencyContactSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("emergency_contact", emergencyContactSchema);
