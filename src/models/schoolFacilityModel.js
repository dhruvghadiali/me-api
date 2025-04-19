const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveSchoolExistsValidator,
  isActiveFacilityExistsValidator,
} = require("@MEHelpers/dbQuery");
const {
  usernameInvalid,
  usernameRequired,
  schoolNameInvalid,
  schoolNameRequired,
  facilityNameInvalid,
  facilityNameRequired,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const schoolFacilitySchema = Schema(
  {
    school: {
      type: Schema.Types.ObjectId,
      required: [true, schoolNameRequired],
      ref: "school",
      validate: {
        validator: async function (value) {
          await isActiveSchoolExistsValidator(value);
        },
        message: schoolNameInvalid,
      },
    },
    facility: {
      type: Schema.Types.ObjectId,
      required: [true, facilityNameRequired],
      ref: "facility",
      validate: {
        validator: async function (value) {
          await isActiveFacilityExistsValidator(value);
        },
        message: facilityNameInvalid,
      },
    },
    is_required: {
      type: Boolean,
      default: false,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
      validate: {
        validator: async function (value) {
          await isActiveUserValidator(value);
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
          await isActiveUserValidator(value);
        },
        message: usernameInvalid,
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schoolFacilitySchema.index(
  { school: 1, facility: 1 },
  { unique: true, index: true }
);

schoolFacilitySchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

schoolFacilitySchema.set("toJSON", {
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
schoolFacilitySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school_facility", schoolFacilitySchema);
