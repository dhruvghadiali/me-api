const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveSchoolExistsValidator,
  isActiveAcademicGradeExistsValidator,
} = require("@MEHelpers/dbQuery");
const {
  schoolNameInvalid,
  schoolNameRequired,
  academicGradeInvalid,
  academicGradeRequired,
  usernameRequired,
  usernameInvalid,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const schoolAcademicGradeSchema = Schema(
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
    is_active: {
      type: Boolean,
      default: true,
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

schoolAcademicGradeSchema.index(
  { school: 1, academic_grade: 1 },
  { unique: true, index: true }
);

schoolAcademicGradeSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

schoolAcademicGradeSchema.set("toJSON", {
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
schoolAcademicGradeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model(
  "school_academic_grade",
  schoolAcademicGradeSchema
);
