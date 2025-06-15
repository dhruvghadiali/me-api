const express = require("express");

const authRouter = require("@MERoutes/schoolAdminRouter/authRouter");
const schoolFeeRouter = require("@MERoutes/schoolAdminRouter/schoolFeeRouter");
const academicClassRouter = require("@MERoutes/schoolAdminRouter/academicClassRouter");
const schoolAcademicClassRouter = require("@MERoutes/schoolAdminRouter/schoolAcademicClassRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", schoolFeeRouter);
router.use("/", academicClassRouter);
router.use("/", schoolAcademicClassRouter);

module.exports = router;
