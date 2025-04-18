const moment = require("moment");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const facilityTypeSchema = Schema(
  {
    facility_type: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.facilityTypeRequired],
      maxlength: [100, validationMessage.facilityTypeMaxLength],
      minlength: [10, validationMessage.facilityTypeMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

facilityTypeSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

facilityTypeSchema.set("toJSON", { virtuals: true });
facilityTypeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("facility_type", facilityTypeSchema);
