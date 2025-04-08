const moment = require("moment");
const mongoose = require("mongoose");

const User = require("@MEModels/userModel");
const validationMessage = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const schoolTypeSchema = Schema(
  {
    school_type: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.schoolTypeNameRequired],
      maxlength: [100, validationMessage.schoolTypeNameMaxLength],
      minlength: [2, validationMessage.schoolTypeNameMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      validate: {
        validator: async function (value) {
          const user = await User.findById(value);
          if (user && user.is_active) {
            return true;
          }
          return false;
        },
        message: validationMessage.usernameInvalid,
      },
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      validate: {
        validator: async function (value) {
          const user = await User.findById(value);
          if (user && user.is_active) {
            return true;
          }
          return false;
        },
        message: validationMessage.usernameInvalid,
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schoolTypeSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

schoolTypeSchema.virtual("created_by_user_info", {
  ref: "user",
  localField: "created_by",
  foreignField: "_id",
});

schoolTypeSchema.virtual("updated_by_user_info", {
  ref: "user",
  localField: "updated_by",
  foreignField: "_id",
});

schoolTypeSchema.virtual("created_by_user").get(function () {
  return this.created_by_user_info?.[0]?.username || null;
});

schoolTypeSchema.virtual("updated_by_user").get(function () {
  return this.updated_by_user_info?.[0]?.username || null;
});

schoolTypeSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, response) {
    response.created_by = response?.created_by_user ? response.created_by_user : null;
    response.updated_by = response?.updated_by_user ? response.updated_by_user : null;
    delete response.created_by_user_info;
    delete response.updated_by_user_info;
    delete response.created_by_user;
    delete response.updated_by_user;
    return response;
  },
});
schoolTypeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("school_type", schoolTypeSchema);
