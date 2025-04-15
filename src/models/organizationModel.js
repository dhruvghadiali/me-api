const moment = require("moment");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage");
const validationConst = require("@MEHelpers/validationConst");
const {
  isActiveUserValidator,
  isStateExistsValidator,
  isDistrictExistsValidator,
  isCityExistsValidator,
  isAreaNameExistsValidator,
  isZipcodeExistsValidator,
} = require("@MEHelpers/modelValidator");

const { Schema } = mongoose;

const organizationSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      required: [true, validationMessage.organizationNameRequired],
      maxlength: [
        validationConst.organizationNameMaxLength,
        validationMessage.organizationNameMaxLength,
      ],
      minlength: [
        validationConst.organizationNameMinLength,
        validationMessage.organizationNameMinLength,
      ],
    },
    short_name: {
      type: String,
      trim: true,
      maxlength: [
        validationConst.organizationShortNameMaxLength,
        validationMessage.organizationShortNameMaxLength,
      ],
      minlength: [
        validationConst.organizationShortNameMinLength,
        validationMessage.organizationShortNameMinLength,
      ],
    },
    email: {
      type: String,
      trim: true,
      required: [true, validationMessage.emailRequired],
      maxlength: [
        validationConst.emailMaxLength,
        validationMessage.emailMaxLength,
      ],
      minlength: [
        validationConst.emailMinLength,
        validationMessage.emailMinLength,
      ],
      match: [emailRegex, validationMessage.emailInvalid],
    },
    phone_number: {
      type: String,
      trim: true,
      required: [true, validationMessage.phoneNumberRequired],
      maxlength: [
        validationConst.phoneNumberLength,
        validationMessage.phoneNumberMaxLength,
      ],
      minlength: [
        validationConst.phoneNumberLength,
        validationMessage.phoneNumberMinLength,
      ],
      match: [phoneRegex, validationMessage.phoneNumberInvalid],
    },
    government_registration_number: {
      type: String,
      trim: true,
      required: [true, validationMessage.governmentRegistrationNumberRequired],
      maxlength: [
        validationConst.governmentRegistrationNumberMaxLength,
        validationMessage.governmentRegistrationNumberMaxLength,
      ],
      minlength: [
        validationConst.governmentRegistrationNumberMinLength,
        validationMessage.governmentRegistrationNumberMinLength,
      ],
    },
    address: {
      type: String,
      trim: true,
      required: [true, validationMessage.addressRequired],
      maxlength: [
        validationConst.addressMaxLength,
        validationMessage.addressMaxLength,
      ],
      minlength: [
        validationConst.addressMinLength,
        validationMessage.addressMinLength,
      ],
    },
    state: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.stateNameRequired],
      ref: "state",
      validate: isStateExistsValidator,
    },
    district: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.districtNameRequired],
      ref: "district",
      validate: isDistrictExistsValidator,
    },
    city: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.cityNameRequired],
      ref: "city",
      validate: isDistrictExistsValidator,
    },
    area_name: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.areaNameRequired],
      ref: "area_name",
      validate: isAreaNameExistsValidator,
    },
    area_name: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.zipcodeRequired],
      ref: "zipcode",
      validate: isZipcodeExistsValidator,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      validate: isActiveUserValidator,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      validate: isActiveUserValidator,
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

organizationSchema.virtual("created_by_user_info", {
  ref: "user",
  localField: "created_by",
  foreignField: "_id",
});

organizationSchema.virtual("updated_by_user_info", {
  ref: "user",
  localField: "updated_by",
  foreignField: "_id",
});

organizationSchema.virtual("created_by_user").get(function () {
  return this.created_by_user_info?.[0]?.username || null;
});

organizationSchema.virtual("updated_by_user").get(function () {
  return this.updated_by_user_info?.[0]?.username || null;
});

organizationSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, response) {
    response.created_by = response?.created_by_user
      ? response.created_by_user
      : null;
    response.updated_by = response?.updated_by_user
      ? response.updated_by_user
      : null;
    delete response.created_by_user_info;
    delete response.updated_by_user_info;
    delete response.created_by_user;
    delete response.updated_by_user;
    return response;
  },
});
organizationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("organization", organizationSchema);
