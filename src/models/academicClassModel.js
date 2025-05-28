const mongoose = require("mongoose");

const { isActiveUserValidator } = require("@MEUtils/dbQuery");
const { getISTDateTime } = require("@MEUtils/utility");

const {
  academicClassMinChar,
  academicClassMaxChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  academicClassRequired,
  academicClassMaxLength,
  academicClassMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const academicClassSchema = Schema(
  {
    academic_class: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, academicClassRequired],
      maxlength: [academicClassMaxChar, academicClassMaxLength],
      minlength: [academicClassMinChar, academicClassMinLength],
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
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

academicClassSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, response) {
    if (response?.created_by?.username) {
      response.created_by = response.created_by.username;
    } else {
      delete response.created_by;
    }

    if (response?.updated_by?.username) {
      response.updated_by = response.updated_by.username;
    } else {
      delete response.updated_by;
    }

    if (response?.created_at) {
      response.created_at = getISTDateTime(response.created_at);
    }

    if (response?.updated_at) {
      response.updated_at = getISTDateTime(response.updated_at);
    }
    return response;
  },
});
academicClassSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("academic_class", academicClassSchema);
