const moment = require("moment");
const mongoose = require("mongoose");

const { isActiveUserValidator } = require("@MEUtils/dbQuery");
const {
  facilityTypeMaxChar,
  facilityTypeMinChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  facilityTypeRequired,
  facilityTypeMaxLength,
  facilityTypeMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const facilityTypeSchema = Schema(
  {
    facility_type: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, facilityTypeRequired],
      maxlength: [facilityTypeMaxChar, facilityTypeMaxLength],
      minlength: [facilityTypeMinChar, facilityTypeMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
      validate: {
        validator: isActiveUserValidator,
        message: usernameInvalid,
      },
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

facilityTypeSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, response) {
    if (response?.created_by?.first_name && response?.created_by?.last_name) {
      response.created_by = `${response.created_by.first_name} ${response.created_by.last_name}`;
    } else {
      delete response.created_by;
    }

    if (response?.updated_by?.first_name && response?.updated_by?.last_name) {
      response.updated_by = `${response.updated_by.first_name} ${response.updated_by.last_name}`;
    } else {
      delete response.updated_by;
    }
    return response;
  },
});
facilityTypeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("facility_type", facilityTypeSchema);
