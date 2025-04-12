const express = require("express");

const authRouter = require("@MERoutes/superAdminRouter/authRouter");
const stateRouter = require("@MERoutes/superAdminRouter/stateRouter");
const feeTypeRouter = require("@MERoutes/superAdminRouter/feeTypeRouter");
const schoolTypeRouter = require("@MERoutes/superAdminRouter/schoolTypeRouter");
const educationBoardRouter = require("@MERoutes/superAdminRouter/educationBoardRouter");
const academicGradeRouter = require("@MERoutes/superAdminRouter/academicGradeRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", stateRouter);
router.use("/", feeTypeRouter);
router.use("/", schoolTypeRouter);
router.use("/", educationBoardRouter);
router.use("/", academicGradeRouter);

module.exports = router;
