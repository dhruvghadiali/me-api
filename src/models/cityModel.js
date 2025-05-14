const moment = require("moment");
const mongoose = require("mongoose");

const { getISTDateTime } = require("@MEUtils/utility");

const {
  isActiveUserValidator,
  isActiveDistrictExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  cityNameMaxChar,
  cityNameMinChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  cityNameRequired,
  cityNameMaxLength,
  cityNameMinLength,
  districtNameRequired,
  districtNameInvalid,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const citySchema = Schema(
  {
    district: {
      type: Schema.Types.ObjectId,
      required: [true, districtNameRequired],
      ref: "district",
      validate: {
        validator: isActiveDistrictExistsValidator,
        message: districtNameInvalid,
      },
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, cityNameRequired],
      maxlength: [cityNameMaxChar, cityNameMaxLength],
      minlength: [cityNameMinChar, cityNameMinLength],
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

citySchema.index({ district: 1, name: 1 }, { unique: true, index: true });

citySchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

citySchema.virtual("area_count", {
  ref: "area_name",
  localField: "_id",
  foreignField: "city",
  count: true,
  options: { match: { is_active: true } },
});

citySchema.virtual("area_names", {
  ref: "area_name",
  localField: "_id",
  foreignField: "city",
});

citySchema.set("toJSON", {
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
citySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("city", citySchema);
