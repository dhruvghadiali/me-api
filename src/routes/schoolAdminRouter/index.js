const express = require("express");

const authRouter = require("@MERoutes/schoolAdminRouter/authRouter");
const academicClassRouter = require("@MERoutes/schoolAdminRouter/academicClassRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", academicClassRouter);

module.exports = router;
