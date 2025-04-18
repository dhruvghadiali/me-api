const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveDistrictExistsValidator,
} = require("@MEHelpers/dbQuery");
const {
  cityNameMaxChar,
  cityNameMinChar,
} = require("@MEHelpers/validationConst/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  cityNameRequired,
  cityNameMaxLength,
  cityNameMinLength,
  districtNameRequired,
  districtNameInvalid,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const citySchema = Schema(
  {
    district: {
      type: Schema.Types.ObjectId,
      required: [true, districtNameRequired],
      ref: "district",
      validate: {
        validator: async function (value) {
          await isActiveDistrictExistsValidator(value);
        },
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

citySchema.index({ district: 1, name: 1 }, { unique: true, index: true });

citySchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

// citySchema.virtual("districts", {
//   ref: "district",
//   foreignField: "_id",
//   localField: "district",
//   justOne: true,
// });

// citySchema.virtual("area_count", {
//   ref: "area_name",
//   localField: "_id",
//   foreignField: "city",
//   count: true,
//   options: { match: { is_active: true } },
// });

// citySchema.virtual("areaNames", {
//   ref: "area_name",
//   localField: "_id",
//   foreignField: "city",
// });

citySchema.set("toJSON", {
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
citySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("city", citySchema);
