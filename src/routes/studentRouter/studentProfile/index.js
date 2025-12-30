const express = require("express");

const getStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/getStudentProfileRouter");
const addStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/addStudentProfileRouter");

const router = express.Router();

router.use("/", getStudentProfileRouter);
router.use("/", addStudentProfileRouter);

module.exports = router;
