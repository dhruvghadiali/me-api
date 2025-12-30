const express = require("express");

const getStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/getStudentProfileRouter");

const router = express.Router();

router.use("/", getStudentProfileRouter);

module.exports = router;
