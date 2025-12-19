const express = require("express");

const authRouter = require("@MERoutes/studentRouter/authRouter");
const schoolRouter = require("@MERoutes/studentRouter/schoolRouter");
const admissionApplicationRouter = require("@MERoutes/studentRouter/admissionApplicationRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", schoolRouter);
router.use("/", admissionApplicationRouter);

module.exports = router;
