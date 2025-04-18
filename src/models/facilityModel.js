const moment = require("moment");
const mongoose = require("mongoose");

const Facility = require("@MEModels/facilityModel");
const validationMessage = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const facilitySchema = Schema(
  {
    facility_type: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.facilityTypeRequired],
      ref: "facility_type",
      validate: {
        validator: async function (value) {
          const facilityExists = await Facility.findById(value);
          return !!facilityExists;
        },
        message: validationMessage.facilityTypeInvalid,
      },
    },
    facility_name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, validationMessage.facilityNameRequired],
      maxlength: [100, validationMessage.facilityNameMaxLength],
      minlength: [10, validationMessage.facilityNameMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

facilitySchema.index(
  { facility_type: 1, name: 1 },
  { unique: true, index: true }
);

facilitySchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

facilitySchema.set("toJSON", { virtuals: true });
facilitySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("facility", facilitySchema);
