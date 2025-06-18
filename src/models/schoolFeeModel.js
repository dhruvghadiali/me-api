const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveFeeTypeExistsValidator,
  isActiveSchoolAcademicClassExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  usernameInvalid,
  usernameRequired,
  feeTypeIdInvalid,
  feeTypeIdRequired,
  yearlyFeeRequired,
  yearlyFeeMaxAmount,
  yearlyFeeMinAmount,
  monthlyFeeRequired,
  monthlyFeeMaxAmount,
  monthlyFeeMinAmount,
  quarterlyFeeRequired,
  quarterlyFeeMaxAmount,
  quarterlyFeeMinAmount,
  halfYearlyFeeRequired,
  halfYearlyFeeMaxAmount,
  halfYearlyFeeMinAmount,
  schoolAcademicClassIdInvalid,
  schoolAcademicClassIdRequired,
} = require("@MEHelpers/validationMessage");
const { maxFeeAmount, minFeeAmount } = require("@MEHelpers/validationConst");

const { Schema } = mongoose;

const schoolFeeSchema = Schema(
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
    fee_type: {
      type: Schema.Types.ObjectId,
      ref: "fee_type",
      required: [true, feeTypeIdRequired],
      validate: {
        validator: isActiveFeeTypeExistsValidator,
        message: feeTypeIdInvalid,
      },
    },
    monthly_fee: {
      type: Number,
      required: [true, monthlyFeeRequired],
      min: [minFeeAmount, monthlyFeeMinAmount],
      max: [maxFeeAmount, monthlyFeeMaxAmount],
    },
    quarterly_fee: {
      type: Number,
      required: [true, quarterlyFeeRequired],
      min: [minFeeAmount, quarterlyFeeMinAmount],
      max: [maxFeeAmount, quarterlyFeeMaxAmount],
    },
    half_yearly_fee: {
      type: Number,
      required: [true, halfYearlyFeeRequired],
      min: [minFeeAmount, halfYearlyFeeMinAmount],
      max: [maxFeeAmount, halfYearlyFeeMaxAmount],
    },
    yearly_fee: {
      type: Number,
      required: [true, yearlyFeeRequired],
      min: [minFeeAmount, yearlyFeeMinAmount],
      max: [maxFeeAmount, yearlyFeeMaxAmount],
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

schoolFeeSchema.index(
  { school_academic_class: 1, fee_type: 1 },
  { unique: true, index: true }
);

schoolFeeSchema.set("toJSON", {
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
schoolFeeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school_fee", schoolFeeSchema);
