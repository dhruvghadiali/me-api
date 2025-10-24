const express = require("express");

const authRouter = require("@MERoutes/studentRouter/authRouter");
const admissionApplicationRouter = require("@MERoutes/studentRouter/admissionApplicationRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", admissionApplicationRouter);

module.exports = router;
