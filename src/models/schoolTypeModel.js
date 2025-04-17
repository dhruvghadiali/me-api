const moment = require("moment");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage");
const { isActiveUserValidator } = require("@MEHelpers/modelValidator");

const { Schema } = mongoose;

const schoolTypeSchema = Schema(
  {
    school_type: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.schoolTypeRequired],
      maxlength: [100, validationMessage.schoolTypeMaxLength],
      minlength: [2, validationMessage.schoolTypeMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      // validate: isActiveUserValidator(),
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      // validate: isActiveUserValidator(),
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
