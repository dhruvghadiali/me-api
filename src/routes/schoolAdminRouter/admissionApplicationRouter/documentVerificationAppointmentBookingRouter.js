const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  documentVerificationAppointmentBooking,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route(
    "/admission-applications/:id/document-verification-appointment-booking"
  )
  .put(schoolAdminProtect, documentVerificationAppointmentBooking);

module.exports = router;
