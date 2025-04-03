const express = require("express");

const authRouter = require("@MERoutes/superAdminRouter/authRouter");
const eductionBoardRouter = require("@MERoutes/superAdminRouter/eductionBoardRouter");
const schoolTypeRouter = require("@MERoutes/superAdminRouter/schoolTypeRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", eductionBoardRouter);
router.use("/", schoolTypeRouter);

module.exports = router;