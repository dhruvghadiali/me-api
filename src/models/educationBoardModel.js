const moment = require("moment");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage");
const { isActiveUserValidator } = require("@MEHelpers/modelValidator");

const { Schema } = mongoose;

const educationBoardSchema = Schema(
  {
    education_board: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.educationBoardRequired],
      maxlength: [100, validationMessage.educationBoardMaxLength],
      minlength: [2, validationMessage.educationBoardMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      validate: isActiveUserValidator,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      validate: isActiveUserValidator,
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
