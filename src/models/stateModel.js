const moment = require("moment");
const mongoose = require("mongoose");

const { isActiveUserValidator } = require("@MEHelpers/dbQuery");
const {
  stateNameMaxChar,
  stateNameMinChar,
} = require("@MEHelpers/validationConst/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  stateNameRequired,
  stateNameMaxLength,
  stateNameMinLength,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const stateSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, stateNameRequired],
      maxlength: [stateNameMaxChar, stateNameMaxLength],
      minlength: [stateNameMinChar, stateNameMinLength],
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

stateSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

// stateSchema.virtual("district_count", {
//   ref: "district",
//   localField: "_id",
//   foreignField: "state",
//   count: true,
//   options: { match: { is_active: true } },
// });

// stateSchema.virtual("districts", {
//   ref: "district",
//   localField: "_id",
//   foreignField: "state",
// });

stateSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, response) {
    response.created_by = response?.created_by?.username
      ? response.created_by.username
      : null;
    response.updated_by = response?.updated_by?.username
      ? response.updated_by.username
      : null;
    return response;
  },
});
stateSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("state", stateSchema);
