const mongoose = require("mongoose");

const { Schema } = mongoose;

const siblingProfileSchema = new Schema(
  {
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["male", "female", "other"],
    },
    date_of_birth: { type: Date },
    studying_in_class: { type: Schema.Types.ObjectId, ref: "academic_class" },
    school_name: { type: String, trim: true, lowercase: true },
    same_school: { type: Boolean, default: false },
    admission_number: { type: String, trim: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("sibling_profile", siblingProfileSchema);
