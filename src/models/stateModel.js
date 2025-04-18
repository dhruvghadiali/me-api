const moment = require("moment");
const mongoose = require("mongoose");
const validationMessage = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const stateSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.stateNameRequired],
      maxlength: [100, validationMessage.stateNameMaxLength],
      minlength: [2, validationMessage.stateNameMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

stateSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

stateSchema.virtual("district_count", {
  ref: "district",
  localField: "_id",
  foreignField: "state",
  count: true,
  options: { match: { is_active: true } },
});

stateSchema.virtual("districts", {
  ref: "district",
  localField: "_id",
  foreignField: "state",
});

stateSchema.set("toJSON", { virtuals: true });
stateSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("state", stateSchema);
