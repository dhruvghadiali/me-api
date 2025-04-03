const moment = require("moment");
const mongoose = require("mongoose");

const State = require("@MEModels/stateModel");
const validationMessage = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const districtSchema = Schema(
  {
    state: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.stateNameRequired],
      ref: "state",
      validate: {
        validator: async function (value) {
          const stateExists = await State.findById(value);
          return !!stateExists;
        },
        message: validationMessage.stateNameInvalid,
      },
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, validationMessage.districtNameRequired],
      maxlength: [100, validationMessage.districtNameMaxLength],
      minlength: [2, validationMessage.districtNameMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

districtSchema.index({ state: 1, name: 1 }, { unique: true, index: true });

districtSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

districtSchema.virtual("states", {
  ref: "state",
  foreignField: "_id",
  localField: "state",
  justOne: true,
});

districtSchema.virtual("city_count", {
  ref: "city",
  localField: "_id",
  foreignField: "district",
  count: true,
  options: { match: { is_active: true } },
});

districtSchema.virtual("cities", {
  ref: "city",
  localField: "_id",
  foreignField: "district",
});

districtSchema.set("toJSON", { virtuals: true });
districtSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("district", districtSchema);
