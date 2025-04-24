const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveFacilityTypeExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  facilityNameMaxChar,
  facilityNameMinChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  facilityTypeInvalid,
  facilityTypeRequired,
  facilityNameRequired,
  facilityNameMaxLength,
  facilityNameMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const facilitySchema = Schema(
  {
    facility_type: {
      type: Schema.Types.ObjectId,
      required: [true, facilityTypeRequired],
      ref: "facility_type",
      validate: {
        validator: isActiveFacilityTypeExistsValidator,
        message: facilityTypeInvalid,
      },
    },
    facility_name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, facilityNameRequired],
      maxlength: [facilityNameMaxChar, facilityNameMaxLength],
      minlength: [facilityNameMinChar, facilityNameMinLength],
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

facilitySchema.index(
  { facility_type: 1, name: 1 },
  { unique: true, index: true }
);

facilitySchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

facilitySchema.set("toJSON", {
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
facilitySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("facility", facilitySchema);
