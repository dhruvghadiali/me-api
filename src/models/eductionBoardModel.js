const moment = require("moment");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage");
const { isActiveUserValidator } = require("@MEUtils/utility");

const { Schema } = mongoose;

const eductionBoardSchema = Schema(
  {
    eduction_board: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.eductionBoardRequired],
      maxlength: [100, validationMessage.eductionBoardMaxLength],
      minlength: [10, validationMessage.eductionBoardMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      validate: isActiveUserValidator,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, validationMessage.usernameRequired],
      ref: "user",
      validate: isActiveUserValidator,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

eductionBoardSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

eductionBoardSchema.virtual("created_by_user_info", {
  ref: "user",
  localField: "created_by",
  foreignField: "_id",
});

eductionBoardSchema.virtual("updated_by_user_info", {
  ref: "user",
  localField: "updated_by",
  foreignField: "_id",
});

eductionBoardSchema.virtual("created_by_user").get(function () {
  return this.created_by_user_info?.[0]?.username || null;
});

eductionBoardSchema.virtual("updated_by_user").get(function () {
  return this.updated_by_user_info?.[0]?.username || null;
});

eductionBoardSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, response) {
    response.created_by = response?.created_by_user
      ? response.created_by_user
      : null;
    response.updated_by = response?.updated_by_user
      ? response.updated_by_user
      : null;
    delete response.created_by_user_info;
    delete response.updated_by_user_info;
    delete response.created_by_user;
    delete response.updated_by_user;
    return response;
  },
});
eductionBoardSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("eduction_board", eductionBoardSchema);
