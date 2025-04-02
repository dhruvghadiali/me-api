const moment = require("moment");
const mongoose = require("mongoose");

const District = require("@MEModels/districtModel");
const validationMessage = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const citySchema = Schema(
  {
    district: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.districtNameRequired],
      ref: "district",
      validate: {
        validator: async function (value) {
          const districtExists = await District.findById(value);
          return !!districtExists; 
        },
        message: validationMessage.districtNameInvalid,
      },
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, validationMessage.cityNameRequired],
      maxlength: [100, validationMessage.cityNameMaxLength],
      minlength: [2, validationMessage.cityNameMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

citySchema.index({ district: 1, name: 1 }, { unique: true, index: true });

citySchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

citySchema.virtual("districts", {
  ref: "district",
  foreignField: "_id",
  localField: "district",
  justOne: true,
});

citySchema.virtual("area_count", {
  ref: "area_name",
  localField: "_id",
  foreignField: "city",
  count: true,
  options: { match: { is_active: true } },
});

citySchema.virtual("areaNames", {
  ref: "area_name",
  localField: "_id",
  foreignField: "city",
});

citySchema.set("toJSON", { virtuals: true });
citySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("city", citySchema);
