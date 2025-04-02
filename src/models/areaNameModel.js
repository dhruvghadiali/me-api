const moment = require("moment");
const mongoose = require("mongoose");

const City = require("@MEModels/cityModel");
const validationMessage = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const areaNameSchema = Schema(
  {
    city: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.cityNameRequired],
      ref: 'city',
      validate: {
        validator: async function (value) {
          const cityExists = await City.findById(value);
          return !!cityExists; 
        },
        message: validationMessage.cityNameInvalid,
      },
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, validationMessage.areaNameRequired],
      maxlength: [100, validationMessage.areaNameMaxLength],
      minlength: [2, validationMessage.areaNameMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

areaNameSchema.index({ city: 1, name: 1,  }, { unique: true, index: true, });

areaNameSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

areaNameSchema.virtual("cities", {
  ref: "city",
  foreignField: "_id",
  localField: "city",
  justOne: true,
});

areaNameSchema.virtual("zipcode_count", {
  ref: "zipcode",
  localField: "_id",
  foreignField: "area_name",
  count: true,
  options: { match: { is_active: true } },
});

areaNameSchema.virtual("zipcodes", {
  ref: "zipcode",
  localField: "_id",
  foreignField: "area_name",
});

areaNameSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("area_name", areaNameSchema);
