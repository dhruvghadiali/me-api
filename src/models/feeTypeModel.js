const moment = require("moment");
const mongoose = require("mongoose");

const { isActiveUserValidator } = require("@MEHelpers/dbQuery");

const {
  feeTypeMaxChar,
  feeTypeMinChar,
} = require("@MEHelpers/validationConst/validationConst");
const {
  usernameInvalid,
  feeTypeRequired,
  usernameRequired,
  feeTypeMaxLength,
  feeTypeMinLength,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const feeTypeSchema = Schema(
  {
    fee_type: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, feeTypeRequired],
      maxlength: [feeTypeMaxChar, feeTypeMaxLength],
      minlength: [feeTypeMinChar, feeTypeMinLength],
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

feeTypeSchema.set("toJSON", {
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
feeTypeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("fee_type", feeTypeSchema);
