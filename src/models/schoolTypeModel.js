const moment = require("moment");
const mongoose = require("mongoose");

const { isActiveUserValidator } = require("@MEUtils/dbQuery");
const {
  schoolTypeMaxChar,
  schoolTypeMinChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  schoolTypeRequired,
  schoolTypeMaxLength,
  schoolTypeMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const schoolTypeSchema = Schema(
  {
    school_type: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, schoolTypeRequired],
      maxlength: [schoolTypeMaxChar, schoolTypeMaxLength],
      minlength: [schoolTypeMinChar, schoolTypeMinLength],
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

schoolTypeSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

schoolTypeSchema.set("toJSON", {
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
schoolTypeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school_type", schoolTypeSchema);
