const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const crypto = require("crypto");

const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || "your_razorpay_secret";

// ✅ Initiate Payment
router.post("/initiate", async (req, res) => {
  try {
    const { userId, amount, purpose } = req.body;
    const payment = await Payment.create({ userId, amount, purpose });
    res.status(201).json({ success: true, paymentId: payment._id });
  } catch (err) {
    res.status(500).json({ success: false, message: "Initiation failed" });
  }
});

// ✅ Payment Success
router.post("/success", async (req, res) => {
  const {
    paymentId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  try {
    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const updated = await Payment.findByIdAndUpdate(
      paymentId,
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: "success",
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Success update failed" });
  }
});

// ❌ Payment Failure
router.post("/failure", async (req, res) => {
  const { paymentId, failure_reason } = req.body;
  try {
    const updated = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: "failed",
        failure_reason,
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failure update failed" });
  }
});

// 📩 Optional: Razorpay Webhook
/**
 * This endpoint is called by Razorpay itself — not by your frontend or backend directly.

You configure a Webhook URL inside the Razorpay dashboard (like https://yourdomain.com/api/payment/webhook), and Razorpay will call this automatically when certain payment events happen.
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET || "your_webhook_secret";

    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (signature === expected) {
      // TODO: Handle webhook events like payment.captured
      return res.status(200).json({ status: "received" });
    } else {
      return res.status(403).json({ status: "signature mismatch" });
    }
  }
);

module.exports = router;
