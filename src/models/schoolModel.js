const moment = require("moment");
const mongoose = require("mongoose");

const { isActiveUserValidator } = require("@MEHelpers/dbQuery");
const {
  schoolNameMaxChar,
  schoolNameMinChar,
  schoolShortNameMaxChar,
  schoolShortNameMinChar,
} = require("@MEHelpers/validationConst/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  schoolNameRequired,
  schoolNameMaxLength,
  schoolNameMinLength,
  schoolShortNameRequired,
  schoolShortNameMaxLength,
  schoolShortNameMinLength,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const schoolSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, schoolNameRequired],
      maxlength: [schoolNameMaxChar, schoolNameMaxLength],
      minlength: [schoolNameMinChar, schoolNameMinLength],
    },
    short_name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, schoolShortNameRequired],
      maxlength: [schoolShortNameMaxChar, schoolShortNameMaxLength],
      minlength: [schoolShortNameMinChar, schoolShortNameMinLength],
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

schoolSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

schoolSchema.set("toJSON", {
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
schoolSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school", schoolSchema);
