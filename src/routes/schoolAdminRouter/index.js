const express = require("express");

const authRouter = require("@MERoutes/schoolAdminRouter/authRouter");
const feeTypeRouter = require("@MERoutes/schoolAdminRouter/feeTypeRouter");
const schoolFeeRouter = require("@MERoutes/schoolAdminRouter/schoolFeeRouter");
const facilityTypeRouter = require("@ME/routes/schoolAdminRouter/facilityTypeRouter");
const academicClassRouter = require("@MERoutes/schoolAdminRouter/academicClassRouter");
const schoolFacilityRouter = require("@MERoutes/schoolAdminRouter/schoolFacilityRouter");
const admissionDocumentRouter = require("@MERoutes/schoolAdminRouter/admissionDocumentRouter");
const schoolAcademicClassRouter = require("@MERoutes/schoolAdminRouter/schoolAcademicClassRouter");
const admissionApplicationRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter");
const schoolAdmissionDocumentRouter = require("@MERoutes/schoolAdminRouter/schoolAdmissionDocumentRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", feeTypeRouter);
router.use("/", facilityTypeRouter);
router.use("/", schoolFeeRouter);
router.use("/", academicClassRouter);
router.use("/", schoolFacilityRouter);
router.use("/", admissionDocumentRouter);
router.use("/", schoolAcademicClassRouter);
router.use("/", admissionApplicationRouter);
router.use("/", schoolAdmissionDocumentRouter);

module.exports = router;
