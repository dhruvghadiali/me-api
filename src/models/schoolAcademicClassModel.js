const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveSchoolExistsValidator,
  isActiveAcademicClassExistsValidator,
  isActiveEducationBoardExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  usernameInvalid,
  usernameRequired,
  academicClassInvalid,
  academicClassRequired,
  educationBoardNotFound,
  educationBoardRequired,
  schoolDetailsInvalid,
  schoolDetailsRequired,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const schoolAcademicClassSchema = Schema(
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
    education_board: {
      type: Schema.Types.ObjectId,
      ref: "education_board",
      required: [true, educationBoardRequired],
      validate: {
        validator: isActiveEducationBoardExistsValidator,
        message: educationBoardNotFound,
      },
    },
    academic_class: {
      type: Schema.Types.ObjectId,
      ref: "academic_class",
      required: [true, academicClassRequired],
      validate: {
        validator: isActiveAcademicClassExistsValidator,
        message: academicClassInvalid,
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

schoolAcademicClassSchema.index(
  { school: 1, education_board: 1, academic_class: 1 },
  { unique: true, index: true }
);

schoolAcademicClassSchema.set("toJSON", {
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
schoolAcademicClassSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model(
  "school_academic_class",
  schoolAcademicClassSchema
);
