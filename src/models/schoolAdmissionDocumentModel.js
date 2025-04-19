const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveSchoolExistsValidator,
  isActiveAdmissionDocumentTypeExistsValidator,
} = require("@MEHelpers/dbQuery");
const {
  usernameInvalid,
  usernameRequired,
  schoolNameInvalid,
  schoolNameRequired,
  admissionDocumentTypeInvalid,
  admissionDocumentTypeRequired,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const schoolAdmissionDocumentSchema = Schema(
  {
    school: {
      type: Schema.Types.ObjectId,
      required: [true, schoolNameRequired],
      ref: "school",
      validate: {
        validator: async function (value) {
          await isActiveSchoolExistsValidator(value);
        },
        message: schoolNameInvalid,
      },
    },
    admission_document_type: {
      type: Schema.Types.ObjectId,
      required: [true, admissionDocumentTypeRequired],
      ref: "admission_document_type",
      validate: {
        validator: async function (value) {
          await isActiveAdmissionDocumentTypeExistsValidator(value);
        },
        message: admissionDocumentTypeInvalid,
      },
    },
    is_required: {
      type: Boolean,
      default: false,
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

schoolAdmissionDocumentSchema.index(
  { school: 1, admission_document_type: 1 },
  { unique: true, index: true }
);

schoolAdmissionDocumentSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

schoolAdmissionDocumentSchema.set("toJSON", {
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
schoolAdmissionDocumentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model(
  "school_admission_document",
  schoolAdmissionDocumentSchema
);
