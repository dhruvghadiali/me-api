const moment = require("moment");
const mongoose = require("mongoose");

const AreaName = require("@MEModels/areaNameModel");
const validationMessage = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const zipcodeSchema = Schema(
  {
    area_name: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.areaNameRequired],
      ref: 'area_name',
      validate: {
        validator: async function (value) {
          const areaNameExists = await AreaName.findById(value);
          return !!areaNameExists; 
        },
        message: validationMessage.areaNameInvalid,
      },
    },
    zipcode: {
      type: String,
      trim: true,
      required: [true, validationMessage.zipcodeRequired],
      match: [/^[1-9][0-9]{5}$/, validationMessage.invalidZipcode],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

zipcodeSchema.index({ area_name: 1, zipcode: 1,  }, { unique: true, index: true, });

zipcodeSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

zipcodeSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("zipcode", zipcodeSchema);
