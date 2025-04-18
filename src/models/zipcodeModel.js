const moment = require("moment");
const mongoose = require("mongoose");

const { zipcode } = require("@MEHelpers/regex");

const {
  isActiveUserValidator,
  isActiveAreaNameExistsValidator,
} = require("@MEHelpers/dbQuery");
const {
  usernameInvalid,
  zipcodeRequired,
  invalidZipcode,
  usernameRequired,
  areaNameRequired,
  areaNameInvalid,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const zipcodeSchema = Schema(
  {
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
      type: String,
      trim: true,
      required: [true, zipcodeRequired],
      match: [zipcode, invalidZipcode],
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

zipcodeSchema.index(
  { area_name: 1, zipcode: 1 },
  { unique: true, index: true }
);

zipcodeSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

zipcodeSchema.set("toJSON", {
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
zipcodeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("zipcode", zipcodeSchema);
