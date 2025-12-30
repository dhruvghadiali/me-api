const express = require("express");

const authRouter = require("@MERoutes/studentRouter/authRouter");
const schoolRouter = require("@MERoutes/studentRouter/schoolRouter");
const studentProfileRouter = require("@MERoutes/studentRouter/studentProfile/index");
const addressProfileRouter = require("@MERoutes/studentRouter/addressProfileRouter");
const admissionApplicationRouter = require("@MERoutes/studentRouter/admissionApplicationRouter");

const router = express.Router();

router.use("/", authRouter);
router.use("/", schoolRouter);
router.use("/", addressProfileRouter);
router.use("/", studentProfileRouter);
router.use("/", admissionApplicationRouter);

module.exports = router;
