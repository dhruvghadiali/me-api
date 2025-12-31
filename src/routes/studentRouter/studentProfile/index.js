const express = require("express");

const getStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/getStudentProfileRouter");
const addStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/addStudentProfileRouter");
const updateStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateStudentProfileRouter");

const router = express.Router();

router.use("/", getStudentProfileRouter);
router.use("/", addStudentProfileRouter);
router.use("/", updateStudentProfileRouter);

module.exports = router;
