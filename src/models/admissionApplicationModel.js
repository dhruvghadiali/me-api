const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveSchoolAcademicClassExistsValidator,
  validateDocumentNotesRequired,
} = require("@MEUtils/dbQuery");
const {
  usernameInvalid,
  usernameRequired,
  schoolAcademicClassIdInvalid,
  schoolAcademicClassIdRequired,
  admissionApplicationAcademicSessionRequired,
  admissionApplicationAcademicSessionInvalid,
  admissionApplicationApplicationNumberRequired,
  admissionApplicationApplicationNumberEmpty,
  admissionApplicationDocumentVerificationNotesRequired,
  admissionApplicationDocumentVerificationScheduleDateRequired,
  admissionApplicationDocumentVerificationScheduleTimeSlotInvalid,
  admissionApplicationDocumentVerificationScheduleTimeSlotRequired,
  admissionApplicationDocumentVerificationSchedulerRequired,
  admissionApplicationFeePaymentDateRequired,
  admissionApplicationFeePaymentTimeSlotRequired,
  admissionApplicationFeePaymentTimeSlotInvalid,
  admissionApplicationFeePaymentSchedulerRequired,
} = require("@MEHelpers/validationMessage");
const {
  ADMISSION_APPLICATION_STATUS,
  ADMISSION_PAYMENT_METHODS,
} = require("@MEHelpers/enums");
const { validateTimeSlot } = require("@MEUtils/utility");
const { minFeeAmount } = require("@MEHelpers/validationConst");

const { Schema } = mongoose;

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
      required: [true, admissionApplicationAcademicSessionRequired], // e.g., "2025-2026"
      validate: {
        validator: function (val) {
          if (typeof val !== "string") return false;
          const match = val.match(/^(\d{4})-(\d{4})$/);
          if (!match) return false;
          const start = parseInt(match[1], 10);
          const end = parseInt(match[2], 10);
          return end === start + 1; // enforce consecutive years
        },
        message: admissionApplicationAcademicSessionInvalid,
      },
    },
    application_number: {
      type: String,
      trim: true,
      required: [true, admissionApplicationApplicationNumberRequired],
      unique: true,
      index: true,
      validate: {
        validator: function (val) {
          if (typeof val !== "string") return false;
          return val.trim().length > 0;
        },
        message: admissionApplicationApplicationNumberEmpty,
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
        notes: {
          type: String,
          trim: true,
          validate: {
            validator: async function (notes) {
              return await validateDocumentNotesRequired(
                notes,
                this.is_verified,
                this.school_admission_document
              );
            },
            message: admissionApplicationDocumentVerificationNotesRequired,
          },
        },
      },
    ],
    document_verification_appointment: [
      {
        scheduled_date: {
          type: Date,
          required: [
            true,
            admissionApplicationDocumentVerificationScheduleDateRequired,
          ],
        },
        scheduled_time_slot: {
          type: String,
          trim: true,
          required: [
            true,
            admissionApplicationDocumentVerificationScheduleTimeSlotRequired,
          ],
          validate: {
            validator: validateTimeSlot,
            message:
              admissionApplicationDocumentVerificationScheduleTimeSlotInvalid,
          },
        },
        booked_at: { type: Date, default: Date.now },
        booked_by: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: [
            true,
            admissionApplicationDocumentVerificationSchedulerRequired,
          ],
        },
        remarks: { type: String, trim: true },
      },
    ],
    fee_payment_appointment: [
      {
        scheduled_date: {
          type: Date,
          required: [true, admissionApplicationFeePaymentDateRequired],
        },
        scheduled_time_slot: {
          type: String,
          trim: true,
          required: [true, admissionApplicationFeePaymentTimeSlotRequired],
          validate: {
            validator: validateTimeSlot,
            message: admissionApplicationFeePaymentTimeSlotInvalid,
          },
        },
        booked_at: { type: Date, default: Date.now },
        booked_by: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: [true, admissionApplicationFeePaymentSchedulerRequired],
        },
        remarks: { type: String, trim: true },
      },
    ],
    fee_payments: [
      {
        fee_type: {
          type: Schema.Types.ObjectId,
          ref: "fee_type",
          required: true,
        },
        amount: { type: Number, required: true, min: minFeeAmount },
        paid_at: { type: Date, default: Date.now },
        txn_id: { type: String, trim: true },
      },
    ],
    payment_method: {
      type: String,
      enum: Object.values(ADMISSION_PAYMENT_METHODS),
      default: ADMISSION_PAYMENT_METHODS.NA,
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
