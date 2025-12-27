const mongoose = require("mongoose");
const moment = require("moment");

const { Schema } = mongoose;

const { GENDERS } = require("@ME/helpers/enums/studentEnums");
const {
  firstNameMinChar,
  firstNameMaxChar,
  lastNameMinChar,
  lastNameMaxChar,
  siblingProfileSchoolNameMinChar,
  siblingProfileSchoolNameMaxChar,
  siblingProfileAdmissionNumberMinChar,
  siblingProfileAdmissionNumberMaxChar,
  siblingProfileDateOfBirthMinAge,
  siblingProfileDateOfBirthMaxAge,
} = require("@MEHelpers/validationConst");
const {
  firstNameRequired,
  firstNameMaxLength,
  firstNameMinLength,
  lastNameRequired,
  lastNameMinLength,
  lastNameMaxLength,
  siblingProfileGenderRequired,
  siblingProfileGenderInvalid,
  siblingProfileDateOfBirthRequired,
  siblingProfileDateOfBirthInvalid,
  siblingProfileSchoolNameMinLength,
  siblingProfileSchoolNameMaxLength,
  siblingProfileAdmissionNumberMinLength,
  siblingProfileAdmissionNumberMaxLength,
  siblingProfileAdmissionNumberInvalid,
} = require("@MEHelpers/validationMessage");

const siblingProfileSchema = new Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, firstNameRequired],
      minlength: [firstNameMinChar, firstNameMinLength],
      maxlength: [firstNameMaxChar, firstNameMaxLength],
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, lastNameRequired],
      minlength: [lastNameMinChar, lastNameMinLength],
      maxlength: [lastNameMaxChar, lastNameMaxLength],
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, siblingProfileGenderRequired],
      enum: {
        values: Object.values(GENDERS),
        message: siblingProfileGenderInvalid,
      },
    },
    date_of_birth: {
      type: Date,
      required: [true, siblingProfileDateOfBirthRequired],
      validate: {
        validator: function (value) {
          if (!value) return false;
          const today = moment().startOf("day");
          const birthDate = moment(value).startOf("day");
          const age = today.diff(birthDate, "years");
          return (
            age >= siblingProfileDateOfBirthMinAge &&
            age <= siblingProfileDateOfBirthMaxAge
          );
        },
        message: siblingProfileDateOfBirthInvalid,
      },
    },
    studying_in_class: {
      type: Schema.Types.ObjectId,
      ref: "academic_class",
      sparse: true,
    },
    same_school: {
      type: Boolean,
      default: false,
    },
    school_name: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [
        siblingProfileSchoolNameMinChar,
        siblingProfileSchoolNameMinLength,
      ],
      maxlength: [
        siblingProfileSchoolNameMaxChar,
        siblingProfileSchoolNameMaxLength,
      ],
    },
    admission_number: {
      type: String,
      trim: true,
      minlength: [
        siblingProfileAdmissionNumberMinChar,
        siblingProfileAdmissionNumberMinLength,
      ],
      maxlength: [
        siblingProfileAdmissionNumberMaxChar,
        siblingProfileAdmissionNumberMaxLength,
      ],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("sibling_profile", siblingProfileSchema);
