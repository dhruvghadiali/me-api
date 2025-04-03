const moment = require("moment");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const schoolTypeSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.schoolTypeNameRequired],
      maxlength: [100, validationMessage.schoolTypeNameMaxLength],
      minlength: [2, validationMessage.schoolTypeNameMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schoolTypeSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

schoolTypeSchema.set("toJSON", { virtuals: true });
schoolTypeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school_type", schoolTypeSchema);
