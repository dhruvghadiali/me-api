const express = require("express");

const getAdmissionApplications = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/getAdmissionApplicationsRouter");
const updateVerifiedDocumentsRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/updateVerifiedDocumentsRouter");
const updateAdmissionApplicationStatusRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/updateAdmissionApplicationStatusRouter");
const documentVerificationAppointmentBookingRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/documentVerificationAppointmentBookingRouter");
const rescheduleDocumentVerificationAppointmentRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/rescheduleDocumentVerificationAppointmentRouter");

const router = express.Router();

router.use("/", getAdmissionApplications);
router.use("/", updateVerifiedDocumentsRouter);
router.use("/", updateAdmissionApplicationStatusRouter);
router.use("/", documentVerificationAppointmentBookingRouter);
router.use("/", rescheduleDocumentVerificationAppointmentRouter);

module.exports = router;
