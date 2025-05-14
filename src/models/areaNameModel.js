const moment = require("moment");
const mongoose = require("mongoose");

const { getISTDateTime } = require("@MEUtils/utility");

const {
  isActiveUserValidator,
  isActiveCityExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  areaNameMaxChar,
  areaNameMinChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  cityNameInvalid,
  cityNameRequired,
  usernameRequired,
  areaNameRequired,
  areaNameMaxLength,
  areaNameMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const areaNameSchema = Schema(
  {
    city: {
      type: Schema.Types.ObjectId,
      required: [true, cityNameRequired],
      ref: "city",
      validate: {
        validator: isActiveCityExistsValidator,
        message: cityNameInvalid,
      },
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, areaNameRequired],
      maxlength: [areaNameMaxChar, areaNameMaxLength],
      minlength: [areaNameMinChar, areaNameMinLength],
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

areaNameSchema.index({ city: 1, name: 1 }, { unique: true, index: true });

areaNameSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

areaNameSchema.virtual("zipcode_count", {
  ref: "zipcode",
  localField: "_id",
  foreignField: "area_name",
  count: true,
  options: { match: { is_active: true } },
});

areaNameSchema.virtual("zipcodes", {
  ref: "zipcode",
  localField: "_id",
  foreignField: "area_name",
});

areaNameSchema.set("toJSON", {
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
areaNameSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("area_name", areaNameSchema);
