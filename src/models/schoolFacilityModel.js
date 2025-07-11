const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveSchoolExistsValidator,
  isActiveFacilityExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  usernameInvalid,
  usernameRequired,
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

  schoolDetailsRequired,
  schoolDetailsInvalid,
  facilityIdRequired,
  facilityIdInvalid,
} = require("@MEHelpers/validationMessage");
const { maxFeeAmount, minFeeAmount } = require("@MEHelpers/validationConst");

const { Schema } = mongoose;

const schoolFacilitySchema = Schema(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: "school",
      required: [true, schoolDetailsRequired],
      validate: {
        validator: isActiveSchoolExistsValidator,
        message: schoolDetailsInvalid,
      },
    },
    facility: {
      type: Schema.Types.ObjectId,
      ref: "facility",
      required: [true, facilityIdRequired],
      validate: {
        validator: isActiveFacilityExistsValidator,
        message: facilityIdInvalid,
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

schoolFacilitySchema.index(
  { school: 1, facility: 1 },
  { unique: true, index: true }
);

schoolFacilitySchema.set("toJSON", {
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
schoolFacilitySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school_facility", schoolFacilitySchema);
