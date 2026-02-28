
const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  feePaymentAppointmentBooking,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route(
    "/admission-applications/:id/fee-payment-appointment-booking"
  )
  .put(schoolAdminProtect, feePaymentAppointmentBooking);

module.exports = router;
