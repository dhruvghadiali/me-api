const express = require("express");

const updateAdmissionApplicationStatusRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/updateAdmissionApplicationStatusRouter");
const documentVerificationAppointmentBookingRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/documentVerificationAppointmentBookingRouter");

const router = express.Router();

router.use("/", updateAdmissionApplicationStatusRouter);
router.use("/", documentVerificationAppointmentBookingRouter);

module.exports = router;
