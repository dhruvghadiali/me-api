const express = require("express");

const authRouter = require("@MERoutes/superAdminRouter/authRouter");
const stateRouter = require("@MERoutes/superAdminRouter/stateRouter");
const schoolTypeRouter = require("@MERoutes/superAdminRouter/schoolTypeRouter");
const eductionBoardRouter = require("@MERoutes/superAdminRouter/eductionBoardRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", stateRouter);
router.use("/", schoolTypeRouter);
router.use("/", eductionBoardRouter);

module.exports = router;