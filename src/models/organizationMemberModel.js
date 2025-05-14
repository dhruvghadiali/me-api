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
} = require("@MEUtils/dbQuery");
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
  organizationDetailsRequired,
  organizationMemberPositionRequired,
  organizationMemberPositionMinLength,
  organizationMemberPositionMaxLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const organizationMemberSchema = Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      required: [true, organizationDetailsRequired],
      ref: "organization",
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

organizationMemberSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, response) {
    if (response?.created_by?.username) {
      response.created_by = response.created_by.username;
    } else {
      delete response.created_by;
    }

    if (response?.updated_by?.username) {
      response.updated_by = response.updated_by.username;
    } else {
      delete response.updated_by;
    }

    if (response?.created_at) {
      response.created_at = getISTDateTime(response.created_at);
    }

    if (response?.updated_at) {
      response.updated_at = getISTDateTime(response.updated_at);
    }

    return response;
  },
});
organizationMemberSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model(
  "organization_member",
  organizationMemberSchema
);
