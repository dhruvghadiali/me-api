const moment = require("moment");
const mongoose = require("mongoose");

const {
  isCityExistsValidator,
  isActiveUserValidator,
} = require("@MEHelpers/modelValidator");
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
        validator: async function (value) {
          await isCityExistsValidator(value);
        },
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

areaNameSchema.index({ city: 1, name: 1 }, { unique: true, index: true });

areaNameSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

// areaNameSchema.virtual("cities", {
//   ref: "city",
//   foreignField: "_id",
//   localField: "city",
//   justOne: true,
// });

// areaNameSchema.virtual("zipcode_count", {
//   ref: "zipcode",
//   localField: "_id",
//   foreignField: "area_name",
//   count: true,
//   options: { match: { is_active: true } },
// });

// areaNameSchema.virtual("zipcodes", {
//   ref: "zipcode",
//   localField: "_id",
//   foreignField: "area_name",
// });

areaNameSchema.set("toJSON", {
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
areaNameSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("area_name", areaNameSchema);
