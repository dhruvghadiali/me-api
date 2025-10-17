const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveSchoolAcademicClassExistsValidator,
} = require("@MEUtils/dbQuery");

const {
  usernameInvalid,
  usernameRequired,
  schoolAcademicClassIdInvalid,
  schoolAcademicClassIdRequired,
  academicSessionRequired,
  academicSessionInvalid,
  applicationNumberRequired,
  applicationNumberEmpty,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const {
  ADMISSION_APPLICATION_STATUS,
  ADMISSION_PAYMENT_METHODS,
} = require("@MEHelpers/enums");

const admissionApplicationSchema = Schema(
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
    applicant_user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
    academic_session: {
      type: String,
      trim: true,
      required: [true, academicSessionRequired], // e.g., "2025-2026"
      validate: {
        validator: function (val) {
          if (typeof val !== "string") return false;
          const match = val.match(/^(\d{4})-(\d{4})$/);
          if (!match) return false;
          const start = parseInt(match[1], 10);
          const end = parseInt(match[2], 10);
          return end === start + 1; // enforce consecutive years
        },
        message: academicSessionInvalid,
      },
    },
    application_number: {
      type: String,
      trim: true,
      required: [true, applicationNumberRequired],
      unique: true,
      index: true,
      validate: {
        validator: function (val) {
          if (typeof val !== "string") return false;
          return val.trim().length > 0;
        },
        message: applicationNumberEmpty,
      },
    },
    status: {
      type: String,
      enum: Object.values(ADMISSION_APPLICATION_STATUS),
      default: ADMISSION_APPLICATION_STATUS.SUBMITTED,
      required: true,
    },
    status_history: [
      {
        status: {
          type: String,
          enum: Object.values(ADMISSION_APPLICATION_STATUS),
          required: true,
        },
        changed_by: { type: Schema.Types.ObjectId, ref: "user" },
        changed_at: { type: Date, default: Date.now },
        remarks: { type: String, trim: true },
      },
    ],
    verified_documents: [
      {
        school_admission_document: {
          type: Schema.Types.ObjectId,
          ref: "school_admission_document",
          required: true,
        },
        is_verified: { type: Boolean, default: false },
        notes: { type: String, trim: true },
      },
    ],
    fee_payments: [
      {
        fee_type: {
          type: Schema.Types.ObjectId,
          ref: "fee_type",
          required: true,
        },
        amount: { type: Number, required: true, min: 0 },
        paid_at: { type: Date, default: Date.now },
        txn_id: { type: String, trim: true },
      },
    ],
    payment_method: {
      type: String,
      enum: Object.values(ADMISSION_PAYMENT_METHODS),
      default: ADMISSION_PAYMENT_METHODS.UPI,
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

admissionApplicationSchema.index(
  { applicant_user: 1, school_academic_class: 1, academic_session: 1 },
  { unique: true, index: true }
);

admissionApplicationSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, response) {
    if (response?.created_by?.first_name && response?.created_by?.last_name) {
      response.created_by = `${response.created_by.first_name} ${response.created_by.last_name}`;
    } else {
      delete response.created_by;
    }

    if (response?.updated_by?.first_name && response?.updated_by?.last_name) {
      response.updated_by = `${response.updated_by.first_name} ${response.updated_by.last_name}`;
    } else {
      delete response.updated_by;
    }
    return response;
  },
});
admissionApplicationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model(
  "admission_application",
  admissionApplicationSchema
);
