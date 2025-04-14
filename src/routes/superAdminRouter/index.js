const express = require("express");

const authRouter = require("@MERoutes/superAdminRouter/authRouter");
const stateRouter = require("@MERoutes/superAdminRouter/stateRouter");
const schoolRouter = require("@MERoutes/superAdminRouter/schoolRouter");
const feeTypeRouter = require("@MERoutes/superAdminRouter/feeTypeRouter");
const schoolTypeRouter = require("@MERoutes/superAdminRouter/schoolTypeRouter");
const academicGradeRouter = require("@MERoutes/superAdminRouter/academicGradeRouter");
const educationBoardRouter = require("@MERoutes/superAdminRouter/educationBoardRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", stateRouter);
router.use("/", schoolRouter);
router.use("/", feeTypeRouter);
router.use("/", schoolTypeRouter);
router.use("/", educationBoardRouter);
router.use("/", academicGradeRouter);

module.exports = router;
