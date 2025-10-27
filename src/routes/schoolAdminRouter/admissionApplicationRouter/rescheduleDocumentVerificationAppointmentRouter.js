const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  rescheduleDocumentVerificationAppointment,
} = require("@MEControllers/admissionApplicationController");

const router = express.Router();

router
  .route(
    "/admission-applications/:id/reschedule-document-verification-appointment"
  )
  .put(schoolAdminProtect, rescheduleDocumentVerificationAppointment);

module.exports = router;
