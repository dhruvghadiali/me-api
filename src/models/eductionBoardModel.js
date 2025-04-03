const moment = require("moment");
const mongoose = require("mongoose");

const validationMessage = require("@MEHelpers/validationMessage");

const { Schema } = mongoose;

const eductionBoardSchema = Schema(
  {
    eduction_board_name: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, validationMessage.eductionBoardNameRequired],
      maxlength: [100, validationMessage.eductionBoardNameMaxLength],
      minlength: [10, validationMessage.eductionBoardNameMinLength],
    },
    is_active: {
      type: Boolean,
      default: true,
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

eductionBoardSchema.set("toJSON", { virtuals: true });
eductionBoardSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("eduction_board", eductionBoardSchema);
