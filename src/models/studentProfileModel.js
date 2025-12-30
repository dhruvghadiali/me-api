const _ = require("lodash");
const moment = require("moment");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const { isActiveUserValidator } = require("@MEUtils/dbQuery");
const { GENDERS, BLOOD_GROUPS } = require("@ME/helpers/enums/studentEnums");
const {
  aadhaarNumberChar,
  studentProfileDateOfBirthMaxAge,
  studentProfileDateOfBirthMinAge,
  studentProfileNationalityMinChar,
  studentProfileNationalityMaxChar,
  studentProfileMedicalIssueDetailMinChar,
  studentProfileMedicalIssueDetailMaxChar,
  studentProfileMedicalAllergiesMinItems,
  studentProfileMedicalAllergiesMaxItems,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  aadhaarNumberMaxLength,
  aadhaarNumberMinLength,
  hearingIssueDetailsRequired,
  visionIssueDetailsRequired,
  physicalIssueDetailsRequired,
  mentalIssueDetailsRequired,
  allergiesAtLeastOne,
  studentProfileInvalidDateOfBirth,
  studentProfileDateOfBirthRequired,
  studentProfileGenderRequired,
  studentProfileGenderInvalid,
  studentProfileBloodGroupRequired,
  studentProfileBloodGroupInvalid,
  studentProfileAadhaarNumberRequired,
  studentProfileNationalityRequired,
  studentProfileNationalityMinLength,
  studentProfileNationalityMaxLength,
  hearingIssueDetailsMinLength,
  hearingIssueDetailsMaxLength,
  visionIssueDetailsMinLength,
  visionIssueDetailsMaxLength,
  physicalIssueDetailsMinLength,
  physicalIssueDetailsMaxLength,
  mentalIssueDetailsMinLength,
  mentalIssueDetailsMaxLength,
  allergiesMinItems,
  allergiesMaxItems,
} = require("@MEHelpers/validationMessage");

const studentProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      unique: true,
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
    date_of_birth: {
      type: Date,
      required: [true, studentProfileDateOfBirthRequired],
      validate: {
        validator: function (date) {
          if (!date) return false;

          const today = moment().startOf("day");
          const birthDate = moment(date).startOf("day");
          const minAge = moment().subtract(
            studentProfileDateOfBirthMaxAge,
            "years"
          );
          const maxAge = moment().subtract(
            studentProfileDateOfBirthMinAge,
            "years"
          );

          // Check if date is today or future
          if (birthDate.isSameOrAfter(today)) {
            return false;
          }

          // Check if age is between 3 and 25 years
          if (birthDate.isBefore(minAge) || birthDate.isAfter(maxAge)) {
            return false;
          }

          return true;
        },
        message: studentProfileInvalidDateOfBirth,
      },
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, studentProfileGenderRequired],
      enum: {
        values: Object.values(GENDERS),
        message: studentProfileGenderInvalid,
      },
    },
    blood_group: {
      type: String,
      trim: true,
      uppercase: true,
      required: [true, studentProfileBloodGroupRequired],
      enum: {
        values: Object.values(BLOOD_GROUPS),
        message: studentProfileBloodGroupInvalid,
      },
    },
    aadhaar_number: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, studentProfileAadhaarNumberRequired],
      maxlength: [aadhaarNumberChar, aadhaarNumberMaxLength],
      minlength: [aadhaarNumberChar, aadhaarNumberMinLength],
    },
    nationality: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, studentProfileNationalityRequired],
      minlength: [
        studentProfileNationalityMinChar,
        studentProfileNationalityMinLength,
      ],
      maxlength: [
        studentProfileNationalityMaxChar,
        studentProfileNationalityMaxLength,
      ],
    },
    medical_info: {
      has_hearing_issue: { type: Boolean, default: false },
      hearing_issue_details: {
        type: String,
        trim: true,
        minlength: [
          studentProfileMedicalIssueDetailMinChar,
          hearingIssueDetailsMinLength,
        ],
        maxlength: [
          studentProfileMedicalIssueDetailMaxChar,
          hearingIssueDetailsMaxLength,
        ],
        validate: {
          validator: function (val) {
            // when has_hearing_issue is false or undefined, skip validation
            if (!this || !this.has_hearing_issue) return true;

            // when has_hearing_issue is true, hearing_issue_details must be a non-empty string
            return _.isString(val) && !_.isEmpty(val.trim());
          },
          message: hearingIssueDetailsRequired,
        },
      },
      has_vision_issue: { type: Boolean, default: false },
      vision_issue_details: {
        type: String,
        trim: true,
        minlength: [
          studentProfileMedicalIssueDetailMinChar,
          visionIssueDetailsMinLength,
        ],
        maxlength: [
          studentProfileMedicalIssueDetailMaxChar,
          visionIssueDetailsMaxLength,
        ],
        validate: {
          validator: function (val) {
            // when has_vision_issue is false or undefined, skip validation
            if (!this || !this.has_vision_issue) return true;

            // when has_vision_issue is true, vision_issue_details must be a non-empty string
            return _.isString(val) && !_.isEmpty(val.trim());
          },
          message: visionIssueDetailsRequired,
        },
      },
      has_physical_issue: { type: Boolean, default: false },
      physical_issue_details: {
        type: String,
        trim: true,
        minlength: [
          studentProfileMedicalIssueDetailMinChar,
          physicalIssueDetailsMinLength,
        ],
        maxlength: [
          studentProfileMedicalIssueDetailMaxChar,
          physicalIssueDetailsMaxLength,
        ],
        validate: {
          validator: function (val) {
            // when has_physical_issue is false or undefined, skip validation
            if (!this || !this.has_physical_issue) return true;

            // when has_physical_issue is true, physical_issue_details must be a non-empty string
            return _.isString(val) && !_.isEmpty(val.trim());
          },
          message: physicalIssueDetailsRequired,
        },
      },
      has_mental_issue: { type: Boolean, default: false },
      mental_issue_details: {
        type: String,
        trim: true,
        minlength: [
          studentProfileMedicalIssueDetailMinChar,
          mentalIssueDetailsMinLength,
        ],
        maxlength: [
          studentProfileMedicalIssueDetailMaxChar,
          mentalIssueDetailsMaxLength,
        ],
        validate: {
          validator: function (val) {
            // when has_mental_issue is false or undefined, skip validation
            if (!this || !this.has_mental_issue) return true;

            // when has_mental_issue is true, mental_issue_details must be a non-empty string
            return _.isString(val) && !_.isEmpty(val.trim());
          },
          message: mentalIssueDetailsRequired,
        },
      },
      has_allergies: { type: Boolean, default: false },
      allergies: {
        type: [String],
        default: [],
        minItems: [studentProfileMedicalAllergiesMinItems, allergiesMinItems],
        maxItems: [studentProfileMedicalAllergiesMaxItems, allergiesMaxItems],
        validate: {
          validator: function (arr) {
            // when has_allergies is false or undefined, skip validation
            if (!this || !this.has_allergies) return true;

            // when has_allergies is true, allergies must be a non-empty array
            return _.isArray(arr) && !_.isEmpty(arr);
          },
          message: allergiesAtLeastOne,
        },
      },
    },
    photo_url: { type: String, trim: true },
    is_active: { type: Boolean, default: true },
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

studentProfileSchema.index({ user: 1 }, { unique: true, index: true });

studentProfileSchema.set("toJSON", {
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
studentProfileSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("student_profile", studentProfileSchema);
