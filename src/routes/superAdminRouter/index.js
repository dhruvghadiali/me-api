const express = require("express");

const authRouter = require("@MERoutes/superAdminRouter/authRouter");
const cityRouter = require("@MERoutes/superAdminRouter/cityRouter");
const stateRouter = require("@MERoutes/superAdminRouter/stateRouter");
// const schoolRouter = require("@MERoutes/superAdminRouter/schoolRouter");
const zipcodeRouter = require("@MERoutes/superAdminRouter/zipcodeRouter");
// const feeTypeRouter = require("@MERoutes/superAdminRouter/feeTypeRouter");
const districtRouter = require("@MERoutes/superAdminRouter/districtRouter");
const areaNameRouter = require("@MERoutes/superAdminRouter/areaNameRouter");
// const schoolTypeRouter = require("@MERoutes/superAdminRouter/schoolTypeRouter");
// const organizationRouter = require("@MERoutes/superAdminRouter/organizationRouter");
// const schoolAddressRouter = require("@MERoutes/superAdminRouter/schoolAddressRouter");
const academicGradeRouter = require("@MERoutes/superAdminRouter/academicGradeRouter");
// const educationBoardRouter = require("@MERoutes/superAdminRouter/educationBoardRouter");
const admissionDocumentRouter = require("@MERoutes/superAdminRouter/admissionDocumentRouter");
// const organizationMemberRouter = require("@MERoutes/superAdminRouter/organizationMemberRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", cityRouter);
router.use("/", stateRouter);
// router.use("/", schoolRouter);
router.use("/", zipcodeRouter);
// router.use("/", feeTypeRouter);
router.use("/", districtRouter);
router.use("/", areaNameRouter);
// router.use("/", schoolTypeRouter);
// router.use("/", organizationRouter);
// router.use("/", schoolAddressRouter);
router.use("/", academicGradeRouter);
// router.use("/", educationBoardRouter);
router.use("/", admissionDocumentRouter);
// router.use("/", organizationMemberRouter);

module.exports = router;
