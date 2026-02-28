const express = require("express");

const getAdmissionApplications = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/getAdmissionApplicationsRouter");
const updateVerifiedDocumentsRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/updateVerifiedDocumentsRouter");
const getAdmissionApplicationSummary = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/getAdmissionApplicationSummaryRouter");
const feePaymentAppointmentBookingRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/feePaymentAppointmentBookingRouter");
const updateAdmissionApplicationStatusRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/updateAdmissionApplicationStatusRouter");
const documentVerificationAppointmentBookingRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/documentVerificationAppointmentBookingRouter");
const rescheduleDocumentVerificationAppointmentRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/rescheduleDocumentVerificationAppointmentRouter");

const router = express.Router();

router.use("/", getAdmissionApplications);
router.use("/", updateVerifiedDocumentsRouter);
router.use("/", getAdmissionApplicationSummary);
router.use("/", feePaymentAppointmentBookingRouter);
router.use("/", updateAdmissionApplicationStatusRouter);
router.use("/", documentVerificationAppointmentBookingRouter);
router.use("/", rescheduleDocumentVerificationAppointmentRouter);

module.exports = router;
