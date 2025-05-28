const express = require("express");

const authRouter = require("@MERoutes/superAdminRouter/authRouter");
const cityRouter = require("@MERoutes/superAdminRouter/cityRouter");
const stateRouter = require("@MERoutes/superAdminRouter/stateRouter");
const schoolRouter = require("@MERoutes/superAdminRouter/schoolRouter");
const zipcodeRouter = require("@MERoutes/superAdminRouter/zipcodeRouter");
const feeTypeRouter = require("@MERoutes/superAdminRouter/feeTypeRouter");
const facilityRouter = require("@MERoutes/superAdminRouter/facilityRouter");
const districtRouter = require("@MERoutes/superAdminRouter/districtRouter");
const areaNameRouter = require("@MERoutes/superAdminRouter/areaNameRouter");
const schoolTypeRouter = require("@MERoutes/superAdminRouter/schoolTypeRouter");
const schoolAdminRouter = require("@MERoutes/superAdminRouter/schoolAdminRouter");
const facilityTypeRouter = require("@MERoutes/superAdminRouter/facilityTypeRouter");
const organizationRouter = require("@MERoutes/superAdminRouter/organizationRouter");
const schoolAddressRouter = require("@MERoutes/superAdminRouter/schoolAddressRouter");
const academicClassRouter = require("@MERoutes/superAdminRouter/academicClassRouter");
const educationBoardRouter = require("@MERoutes/superAdminRouter/educationBoardRouter");
const admissionDocumentRouter = require("@MERoutes/superAdminRouter/admissionDocumentRouter");
const organizationMemberRouter = require("@MERoutes/superAdminRouter/organizationMemberRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", cityRouter);
router.use("/", stateRouter);
router.use("/", schoolRouter);
router.use("/", zipcodeRouter);
router.use("/", feeTypeRouter);
router.use("/", facilityRouter);
router.use("/", districtRouter);
router.use("/", areaNameRouter);
router.use("/", schoolTypeRouter);
router.use("/", schoolAdminRouter);
router.use("/", facilityTypeRouter);
router.use("/", organizationRouter);
router.use("/", schoolAddressRouter);
router.use("/", academicClassRouter);
router.use("/", educationBoardRouter);
router.use("/", admissionDocumentRouter);
router.use("/", organizationMemberRouter);

module.exports = router;
