const moment = require("moment");
const mongoose = require("mongoose");

const { zipcode } = require("@MEHelpers/regex");
const { getISTDateTime } = require("@MEUtils/utility");

const {
  isActiveUserValidator,
  isActiveAreaNameExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  usernameInvalid,
  zipcodeRequired,
  invalidZipcode,
  usernameRequired,
  areaNameRequired,
  areaNameInvalid,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const zipcodeSchema = Schema(
  {
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
zipcodeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("zipcode", zipcodeSchema);
