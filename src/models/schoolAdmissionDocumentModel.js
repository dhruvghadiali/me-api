const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveAdmissionDocumentValidator,
  isActiveSchoolAcademicClassExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  usernameInvalid,
  usernameRequired,
  admissionDocumentIdInvalid,
  admissionDocumentIdRequired,
  schoolAcademicClassIdInvalid,
  schoolAcademicClassIdRequired,
  schoolAdmissionDocumentNotesMaxLength,
  schoolAdmissionDocumentNotesMinLength,
  schoolAdmissionDocumentVerificationStatusRequired,
} = require("@MEHelpers/validationMessage");
const {
  schoolAdmissionDocumentNotesMaxChar,
  schoolAdmissionDocumentNotesMinChar,
} = require("@MEHelpers/validationConst");

const { Schema } = mongoose;

const schoolAdmissionDocumentSchema = Schema(
  {
    school_academic_class: {
      type: Schema.Types.ObjectId,
      ref: "school_academic_class",
      required: [true, schoolAcademicClassIdRequired],
      validate: {
        validator: isActiveSchoolAcademicClassExistsValidator,
        message: schoolAcademicClassIdInvalid,
      },
    },
    admission_document: {
      type: Schema.Types.ObjectId,
      ref: "admission_document",
      required: [true, admissionDocumentIdRequired],
      validate: {
        validator: isActiveAdmissionDocumentValidator,
        message: admissionDocumentIdInvalid,
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [
        schoolAdmissionDocumentNotesMaxChar,
        schoolAdmissionDocumentNotesMaxLength,
      ],
      minlength: [
        schoolAdmissionDocumentNotesMinChar,
        schoolAdmissionDocumentNotesMinLength,
      ],
    },
    is_required: {
      type: Boolean,
      required: [true, schoolAdmissionDocumentVerificationStatusRequired],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schoolAdmissionDocumentSchema.index(
  { school_academic_class: 1, admission_document: 1 },
  { unique: true, index: true }
);

schoolAdmissionDocumentSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, response) {
    if (response?.created_by?.first_name && response?.created_by?.last_name) {
      response.created_by =
        response.created_by.first_name + " " + response.created_by.last_name;
    } else {
      delete response.created_by;
    }

    if (response?.updated_by?.first_name && response?.updated_by?.last_name) {
      response.updated_by =
        response.updated_by.first_name + " " + response.updated_by.last_name;
    } else {
      delete response.updated_by;
    }
    return response;
  },
});
schoolAdmissionDocumentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model(
  "school_admission_document",
  schoolAdmissionDocumentSchema
);
