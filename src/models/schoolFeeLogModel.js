const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveSchoolAcademicClassExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  feeTypeRequired,
  usernameInvalid,
  feeTypeMaxLength,
  feeTypeMinLength,
  usernameRequired,
  yearlyFeeRequired,
  yearlyFeeMaxAmount,
  yearlyFeeMinAmount,
  monthlyFeeRequired,
  schoolFeesRequired,
  schoolFeesMinLimit,
  schoolFeesMaxLimit,
  monthlyFeeMaxAmount,
  monthlyFeeMinAmount,
  quarterlyFeeRequired,
  quarterlyFeeMaxAmount,
  quarterlyFeeMinAmount,
  halfYearlyFeeRequired,
  halfYearlyFeeMaxAmount,
  halfYearlyFeeMinAmount,
  schoolFeeEndDateInvalid,
  schoolFeeEndDateRequired,
  schoolFeeStartDateInvalid,
  schoolFeeStartDateRequired,
  schoolAcademicClassIdInvalid,
  schoolAcademicClassIdRequired,
} = require("@MEHelpers/validationMessage");
const {
  maxFeeAmount,
  minFeeAmount,
  schoolFeesMaxLimit,
} = require("@MEHelpers/validationConst");

const { Schema } = mongoose;

const schoolFeeLogSchema = Schema(
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
    fees: {
      type: [
        {
          fee_type: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, feeTypeRequired],
            maxlength: [feeTypeMaxChar, feeTypeMaxLength],
            minlength: [feeTypeMinChar, feeTypeMinLength],
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
        },
      ],
      required: [true, schoolFeesRequired],
      validate: [
        {
          validator: function (val) {
            return Array.isArray(val) && val.length >= 1;
          },
          message: schoolFeesMinLimit,
        },
        {
          validator: function (val) {
            return Array.isArray(val) && val.length <= schoolFeesMaxLimit;
          },
          message: schoolFeesMaxLimit,
        },
      ],
    },
    start_date: {
      type: Date,
      required: [true, schoolFeeStartDateRequired],
      validate: {
        validator: function (value) {
          return value > moment().toDate();
        },
        message: schoolFeeStartDateInvalid,
      },
    },
    end_date: {
      type: Date,
      required: [true, schoolFeeEndDateRequired],
      validate: {
        validator: function (value) {
          return value > moment().toDate();
        },
        message: schoolFeeEndDateInvalid,
      },
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

schoolFeeLogSchema.set("toJSON", {
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
schoolFeeLogSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school_fee_log", schoolFeeLogSchema);
