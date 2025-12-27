const mongoose = require("mongoose");
const moment = require("moment");

const { Schema } = mongoose;

const { isActiveUserValidator } = require("@MEUtils/dbQuery");
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
  usernameInvalid,
  usernameRequired,
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
} = require("@MEHelpers/validationMessage");

const siblingProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, usernameRequired],
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
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

siblingProfileSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, response) {
    if (
      _.get(response, "created_by.first_name") &&
      _.get(response, "created_by.last_name")
    ) {
      response.created_by = `${response.created_by.first_name} ${response.created_by.last_name}`;
    } else {
      delete response.created_by;
    }

    if (
      _.get(response, "updated_by.first_name") &&
      _.get(response, "updated_by.last_name")
    ) {
      response.updated_by = `${response.updated_by.first_name} ${response.updated_by.last_name}`;
    } else {
      delete response.updated_by;
    }
    return response;
  },
});
siblingProfileSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("sibling_profile", siblingProfileSchema);
