const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveCityExistsValidator,
  isActiveStateExistsValidator,
  isActiveSchoolExistsValidator,
  isActiveZipcodeExistsValidator,
  isActiveDistrictExistsValidator,
  isActiveAreaNameExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  zipcodeInvalid,
  usernameInvalid,
  zipcodeRequired,
  cityNameInvalid,
  addressRequired,
  areaNameInvalid,
  areaNameRequired,
  stateNameInvalid,
  addressMaxLength,
  cityNameRequired,
  addressMinLength,
  usernameRequired,
  stateNameRequired,
  schoolNameInvalid,
  schoolNameRequired,
  districtNameInvalid,
  districtNameRequired,
} = require("@MEHelpers/validationMessage");
const {
  addressMaxChar,
  addressMinChar,
} = require("@MEHelpers/validationConst");

const { Schema } = mongoose;

const schoolAddressSchema = Schema(
  {
    school: {
      type: Schema.Types.ObjectId,
      required: [true, schoolNameRequired],
      ref: "school",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
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

schoolAddressSchema.index(
  { school: 1, user: 1 },
  { unique: true, index: true }
);

schoolAddressSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

schoolAddressSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, response) {
    response.created_by = response?.created_by?.username
      ? response.created_by.username
      : null;
    response.updated_by = response?.updated_by?.username
      ? response.updated_by.username
      : null;
    return response;
  },
});
schoolAddressSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school_address", schoolAddressSchema);
