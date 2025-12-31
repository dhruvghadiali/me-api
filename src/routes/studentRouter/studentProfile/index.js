const express = require("express");

const addParentProfileRouter = require("@MERoutes/studentRouter/studentProfile/addParentProfileRouter");
const getStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/getStudentProfileRouter");
const addStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/addStudentProfileRouter");
const updateParentProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateParentProfileRouter");
const updateStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateStudentProfileRouter");

const router = express.Router();

router.use("/", addParentProfileRouter);
router.use("/", getStudentProfileRouter);
router.use("/", addStudentProfileRouter);
router.use("/", updateParentProfileRouter);
router.use("/", updateStudentProfileRouter);

module.exports = router;
