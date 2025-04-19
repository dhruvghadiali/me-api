const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveSchoolExistsValidator,
  isActiveFeeTypeExistsValidator,
  isActiveAcademicGradeExistsValidator,
} = require("@MEHelpers/dbQuery");
const {
  feeRequired,
  feeTypeInvalid,
  feeTypeRequired,
  usernameInvalid,
  usernameRequired,
  schoolNameInvalid,
  schoolNameRequired,
  academicGradeInvalid,
  academicGradeRequired,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const schoolFeeSchema = Schema(
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
    fee_type: {
      type: Schema.Types.ObjectId,
      required: [true, feeTypeRequired],
      ref: "fee_type",
      validate: {
        validator: async function (value) {
          await isActiveFeeTypeExistsValidator(value);
        },
        message: feeTypeInvalid,
      },
    },
    academic_grade: {
      type: Schema.Types.ObjectId,
      required: [true, academicGradeRequired],
      ref: "academic_grade",
      validate: {
        validator: async function (value) {
          await isActiveAcademicGradeExistsValidator(value);
        },
        message: academicGradeInvalid,
      },
    },
    fee: {
      type: Number,
      required: [true, feeRequired],
    },
    is_required: {
      type: Boolean,
      default: false,
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

schoolFeeSchema.index(
  { school: 1, fee_type: 1, academic_grade: 1 },
  { unique: true, index: true }
);

schoolFeeSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

schoolFeeSchema.set("toJSON", {
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
schoolFeeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school_fee", schoolFeeSchema);
