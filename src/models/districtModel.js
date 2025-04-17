const moment = require("moment");
const mongoose = require("mongoose");

const {
  isStateExistsValidator,
  isActiveUserValidator,
} = require("@MEHelpers/modelValidator");
const {
  districtNameMinChar,
  districtNameMaxChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  stateNameInvalid,
  stateNameRequired,
  districtNameRequired,
  districtNameMaxLength,
  districtNameMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const districtSchema = Schema(
  {
    state: {
      type: Schema.Types.ObjectId,
      required: [true, stateNameRequired],
      ref: "state",
      validate: {
        validator: async function (value) {
          await isStateExistsValidator(value);
        },
        message: stateNameInvalid,
      },
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, districtNameRequired],
      maxlength: [districtNameMaxChar, districtNameMaxLength],
      minlength: [districtNameMinChar, districtNameMinLength],
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

districtSchema.index({ state: 1, name: 1 }, { unique: true, index: true });

districtSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

// districtSchema.virtual("states", {
//   ref: "state",
//   foreignField: "_id",
//   localField: "state",
//   justOne: true,
// });

// districtSchema.virtual("city_count", {
//   ref: "city",
//   localField: "_id",
//   foreignField: "district",
//   count: true,
//   options: { match: { is_active: true } },
// });

// districtSchema.virtual("cities", {
//   ref: "city",
//   localField: "_id",
//   foreignField: "district",
// });

districtSchema.set("toJSON", {
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
districtSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("district", districtSchema);
