const express = require("express");

const addParentProfileRouter = require("@MERoutes/studentRouter/studentProfile/addParentProfileRouter");
const getStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/getStudentProfileRouter");
const addStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/addStudentProfileRouter");
const addSiblingProfileRouter = require("@MERoutes/studentRouter/studentProfile/addSiblingProfileRouter");
const updateParentProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateParentProfileRouter");
const updateStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateStudentProfileRouter");
const updateSiblingProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateSiblingProfileRouter");

const router = express.Router();

router.use("/", addParentProfileRouter);
router.use("/", getStudentProfileRouter);
router.use("/", addStudentProfileRouter);
router.use("/", addSiblingProfileRouter);
router.use("/", updateParentProfileRouter);
router.use("/", updateStudentProfileRouter);
router.use("/", updateSiblingProfileRouter);

module.exports = router;
