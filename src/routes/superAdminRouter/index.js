const express = require("express");

const authRouter = require("@MERoutes/superAdminRouter/authRouter");
const stateRouter = require("@MERoutes/superAdminRouter/stateRouter");
const feeTypeRouter = require("@MERoutes/superAdminRouter/feeTypeRouter");
const schoolTypeRouter = require("@MERoutes/superAdminRouter/schoolTypeRouter");
const eductionBoardRouter = require("@MERoutes/superAdminRouter/eductionBoardRouter");
const academicGradeRouter = require("@MERoutes/superAdminRouter/academicGradeRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", stateRouter);
router.use("/", feeTypeRouter);
router.use("/", schoolTypeRouter);
router.use("/", eductionBoardRouter);
router.use("/", academicGradeRouter);

module.exports = router;
