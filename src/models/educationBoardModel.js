const moment = require("moment");
const mongoose = require("mongoose");

const { isActiveUserValidator } = require("@MEHelpers/dbQuery");
const {
  educationBoardMinChar,
  educationBoardMaxChar,
} = require("@MEHelpers/validationConst/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  educationBoardRequired,
  educationBoardMaxLength,
  educationBoardMinLength,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const educationBoardSchema = Schema(
  {
    education_board: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, educationBoardRequired],
      maxlength: [educationBoardMaxChar, educationBoardMaxLength],
      minlength: [educationBoardMinChar, educationBoardMinLength],
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

educationBoardSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

educationBoardSchema.set("toJSON", {
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
educationBoardSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("education_board", educationBoardSchema);
