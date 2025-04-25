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
} = require("@MEUtils/dbQuery");
const {
  emailMaxChar,
  emailMinChar,
  addressMaxChar,
  addressMinChar,
  phoneNumberChar,
  organizationNameMaxChar,
  organizationNameMinChar,
  organizationShortNameMaxChar,
  organizationShortNameMinChar,
  governmentRegistrationNumberMaxChar,
  governmentRegistrationNumberMinChar,
} = require("@MEHelpers/validationConst");
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
  areaNameRequired,
  stateNameRequired,
  phoneNumberInvalid,
  phoneNumberRequired,
  districtNameInvalid,
  districtNameRequired,
  phoneNumberMaxLength,
  phoneNumberMinLength,
  organizationNameRequired,
  organizationNameMaxLength,
  organizationNameMinLength,
  organizationShortNameMaxLength,
  organizationShortNameMinLength,
  governmentRegistrationNumberRequired,
  governmentRegistrationNumberMaxLength,
  governmentRegistrationNumberMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const organizationSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      required: [true, organizationNameRequired],
      maxlength: [organizationNameMaxChar, organizationNameMaxLength],
      minlength: [organizationNameMinChar, organizationNameMinLength],
    },
    short_name: {
      type: String,
      trim: true,
      maxlength: [organizationShortNameMaxChar, organizationShortNameMaxLength],
      minlength: [organizationShortNameMinChar, organizationShortNameMinLength],
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
    government_registration_number: {
      type: String,
      trim: true,
      required: [true, governmentRegistrationNumberRequired],
      maxlength: [
        governmentRegistrationNumberMaxChar,
        governmentRegistrationNumberMaxLength,
      ],
      minlength: [
        governmentRegistrationNumberMinChar,
        governmentRegistrationNumberMinLength,
      ],
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
        validator: isActiveStateExistsValidator,
        message: stateNameInvalid,
      },
    },
    district: {
      type: Schema.Types.ObjectId,
      required: [true, districtNameRequired],
      ref: "district",
      validate: {
        validator: isActiveDistrictExistsValidator,
        message: districtNameInvalid,
      },
    },
    city: {
      type: Schema.Types.ObjectId,
      required: [true, cityNameRequired],
      ref: "city",
      validate: {
        validator: isActiveCityExistsValidator,
        message: cityNameInvalid,
      },
    },
    area_name: {
      type: Schema.Types.ObjectId,
      required: [true, areaNameRequired],
      ref: "area_name",
      validate: {
        validator: isActiveAreaNameExistsValidator,
        message: areaNameInvalid,
      },
    },
    zipcode: {
      type: Schema.Types.ObjectId,
      required: [true, zipcodeRequired],
      ref: "zipcode",
      validate: {
        validator: isActiveZipcodeExistsValidator,
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
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

organizationSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

organizationSchema.set("toJSON", {
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
organizationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("organization", organizationSchema);
