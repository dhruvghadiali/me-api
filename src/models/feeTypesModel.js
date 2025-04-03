const moment = require("moment");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const feeTypeSchema = Schema(
  {
    fee_type: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.feeTypeRequired],
      maxlength: [100, validationMessage.feeTypeMaxLength],
      minlength: [2, validationMessage.feeTypeMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

feeTypeSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

feeTypeSchema.set("toJSON", { virtuals: true });
feeTypeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("fee_type", feeTypeSchema);
