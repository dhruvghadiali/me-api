const moment = require("moment");
const mongoose = require("mongoose");

const { isActiveUserValidator } = require("@MEHelpers/dbQuery");
const {
  usernameRequired,
  usernameInvalid,
  paymentAmountRequired,
} = require("@MEHelpers/validationMessage/validationMessage");

const { Schema } = mongoose;

const paymentSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, usernameRequired],
      ref: "user",
      validate: {
        validator: async function (value) {
          return await isActiveUserValidator(value);
        },
        message: usernameInvalid,
      },
    },
    amount: {
      type: Number,
      required: [true, paymentAmountRequired],
    },
    purpose: { type: String },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    status: {
      type: String,
      enum: ["initiated", "success", "failed"],
      default: "initiated",
    },
    failure_reason: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

paymentSchema.pre("save", async function (next) {
  let now = moment.utc(moment());

  this.updated_at = now;
  this.created_at = now;
  this.is_active = true;
  next();
});

paymentSchema.set("toJSON", { virtuals: true });
paymentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("payment", paymentSchema);
