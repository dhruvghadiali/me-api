const mongoose = require("mongoose");

const { isActiveUserValidator } = require("@MEUtils/dbQuery");

const {
  admissionDocumentMaxChar,
  admissionDocumentMinChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  admissionDocumentRequired,
  admissionDocumentMaxLength,
  admissionDocumentMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const admissionDocumentSchema = Schema(
  {
    admission_document: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, admissionDocumentRequired],
      maxlength: [admissionDocumentMaxChar, admissionDocumentMaxLength],
      minlength: [admissionDocumentMinChar, admissionDocumentMinLength],
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

admissionDocumentSchema.set("toJSON", {
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
    return response;
  },
});
admissionDocumentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("admission_document", admissionDocumentSchema);
