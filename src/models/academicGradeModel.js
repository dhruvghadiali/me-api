const moment = require("moment");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const academicGradeSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.academicGradeNameRequired],
      maxlength: [100, validationMessage.academicGradeNameMaxLength],
      minlength: [10, validationMessage.academicGradeNameMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
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

academicGradeSchema.set("toJSON", { virtuals: true });
academicGradeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("academic_grade", academicGradeSchema);
