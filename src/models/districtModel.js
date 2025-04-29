const moment = require("moment");
const mongoose = require("mongoose");

const {
  isActiveUserValidator,
  isActiveStateExistsValidator,
} = require("@MEUtils/dbQuery");
const {
  districtNameMinChar,
  districtNameMaxChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  stateNameInvalid,
  stateNameRequired,
  districtNameRequired,
  districtNameMaxLength,
  districtNameMinLength,
} = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const districtSchema = Schema(
  {
    state: {
      type: Schema.Types.ObjectId,
      required: [true, stateNameRequired],
      ref: "state",
      validate: {
        validator: isActiveStateExistsValidator,
        message: stateNameInvalid,
      },
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, districtNameRequired],
      maxlength: [districtNameMaxChar, districtNameMaxLength],
      minlength: [districtNameMinChar, districtNameMinLength],
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

districtSchema.index({ state: 1, name: 1 }, { unique: true, index: true });

districtSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
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

districtSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, response) {
    if (response?.created_by?.username) {
      response.created_by = response.created_by.username;
    } else {
      delete response.created_by;
    }

    if (response?.updated_by?.username) {
      response.updated_by = response.updated_by.username;
    } else {
      delete response.updated_by;
    }

    return response;
  },
});
districtSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("district", districtSchema);
