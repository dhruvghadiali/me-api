const moment = require("moment");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage");
const { isActiveUserValidator } = require("@MEUtils/utility");

const { Schema } = mongoose;

const academicGradeSchema = Schema(
  {
    academic_grade: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.academicGradeRequired],
      maxlength: [100, validationMessage.academicGradeMaxLength],
      minlength: [2, validationMessage.academicGradeMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      validate: isActiveUserValidator,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      validate: isActiveUserValidator,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

academicGradeSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

academicGradeSchema.virtual("created_by_user_info", {
  ref: "user",
  localField: "created_by",
  foreignField: "_id",
});

academicGradeSchema.virtual("updated_by_user_info", {
  ref: "user",
  localField: "updated_by",
  foreignField: "_id",
});

academicGradeSchema.virtual("created_by_user").get(function () {
  return this.created_by_user_info?.[0]?.username || null;
});

academicGradeSchema.virtual("updated_by_user").get(function () {
  return this.updated_by_user_info?.[0]?.username || null;
});

academicGradeSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, response) {
    response.created_by = response?.created_by_user
      ? response.created_by_user
      : null;
    response.updated_by = response?.updated_by_user
      ? response.updated_by_user
      : null;
    delete response.created_by_user_info;
    delete response.updated_by_user_info;
    delete response.created_by_user;
    delete response.updated_by_user;
    return response;
  },
});
academicGradeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("academic_grade", academicGradeSchema);
