const moment = require("moment");
const mongoose = require("mongoose");

const { emailRegex, phoneRegex } = require("@MEHelpers/regex");
const {
  isActiveUserValidator,
  isActiveCityExistsValidator,
  isActiveStateExistsValidator,
  isActiveZipcodeExistsValidator,
  isActiveDistrictExistsValidator,
  isActiveAreaNameExistsValidator,
  isActiveOrganizationExistsValidator,
} = require("@MEHelpers/dbQuery");
const {
  emailMaxChar,
  emailMinChar,
  addressMaxChar,
  addressMinChar,
  lastNameMaxChar,
  lastNameMinChar,
  phoneNumberChar,
  firstNameMaxChar,
  firstNameMinChar,
  aadhaarNumberChar,
  organizationMemberPositionMaxChar,
  organizationMemberPositionMinChar,
} = require("@MEHelpers/validationConst/validationConst");
const {
  emailInvalid,
  emailRequired,
  emailMaxLength,
  emailMinLength,
  zipcodeInvalid,
  zipcodeRequired,
  usernameInvalid,
  cityNameInvalid,
  addressRequired,
  areaNameInvalid,
  usernameRequired,
  stateNameInvalid,
  addressMaxLength,
  cityNameRequired,
  addressMinLength,
  lastNameRequired,
  areaNameRequired,
  stateNameRequired,
  lastNameMaxLength,
  lastNameMinLength,
  firstNameRequired,
  firstNameMaxLength,
  firstNameMinLength,
  phoneNumberInvalid,
  districtNameInvalid,
  phoneNumberRequired,
  districtNameRequired,
  phoneNumberMaxLength,
  phoneNumberMinLength,
  aadhaarNumberRequired,
  aadhaarNumberMaxLength,
  aadhaarNumberMinLength,
  organizationNameInvalid,
  organizationDetailsRequired,
  organizationMemberPositionRequired,
  organizationMemberPositionMinLength,
  organizationMemberPositionMaxLength,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const organizationMemberSchema = Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      index: true,
      unique: true,
      required: [true, organizationDetailsRequired],
      ref: "organization",
      validate: {
        validator: async function (value) {
          return await isActiveOrganizationExistsValidator(value);
        },
        message: organizationNameInvalid,
      },
    },
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
    position: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, organizationMemberPositionRequired],
      maxlength: [
        organizationMemberPositionMaxChar,
        organizationMemberPositionMaxLength,
      ],
      minlength: [
        organizationMemberPositionMinChar,
        organizationMemberPositionMinLength,
      ],
    },
    aadhaar_number: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, aadhaarNumberRequired],
      maxlength: [aadhaarNumberChar, aadhaarNumberMaxLength],
      minlength: [aadhaarNumberChar, aadhaarNumberMinLength],
    },
    address: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, addressRequired],
      maxlength: [addressMaxChar, addressMaxLength],
      minlength: [addressMinChar, addressMinLength],
    },
    state: {
      type: Schema.Types.ObjectId,
      required: [true, stateNameRequired],
      ref: "state",
      validate: {
        validator: async function (value) {
          return await isActiveStateExistsValidator(value);
        },
        message: stateNameInvalid,
      },
    },
    district: {
      type: Schema.Types.ObjectId,
      required: [true, districtNameRequired],
      ref: "district",
      validate: {
        validator: async function (value) {
          return await isActiveDistrictExistsValidator(value);
        },
        message: districtNameInvalid,
      },
    },
    city: {
      type: Schema.Types.ObjectId,
      required: [true, cityNameRequired],
      ref: "city",
      validate: {
        validator: async function (value) {
          return await isActiveCityExistsValidator(value);
        },
        message: cityNameInvalid,
      },
    },
    area_name: {
      type: Schema.Types.ObjectId,
      required: [true, areaNameRequired],
      ref: "area_name",
      validate: {
        validator: async function (value) {
          return await isActiveAreaNameExistsValidator(value);
        },
        message: areaNameInvalid,
      },
    },
    zipcode: {
      type: Schema.Types.ObjectId,
      required: [true, zipcodeRequired],
      ref: "zipcode",
      validate: {
        validator: async function (value) {
          return await isActiveZipcodeExistsValidator(value);
        },
        message: zipcodeInvalid,
      },
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
      validate: {
        validator: async function (value) {
          return await isActiveUserValidator(value);
        },
        message: usernameInvalid,
      },
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
      validate: {
        validator: async function (value) {
          return await isActiveUserValidator(value);
        },
        message: usernameInvalid,
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

organizationMemberSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

organizationMemberSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, response) {
    response.created_by = response?.created_by?.username
      ? response.created_by.username
      : null;
    response.updated_by = response?.updated_by?.username
      ? response.updated_by.username
      : null;
    return response;
  },
});
organizationMemberSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model(
  "organization_member",
  organizationMemberSchema
);
