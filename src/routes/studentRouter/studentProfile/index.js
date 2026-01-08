const express = require("express");

const addParentProfileRouter = require("@MERoutes/studentRouter/studentProfile/addParentProfileRouter");
const getStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/getStudentProfileRouter");
const addStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/addStudentProfileRouter");
const addSiblingProfileRouter = require("@MERoutes/studentRouter/studentProfile/addSiblingProfileRouter");
const addAddressProfileRouter = require("@MERoutes/studentRouter/studentProfile/addAddressProfileRouter");
const updateParentProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateParentProfileRouter");
const updateStudentProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateStudentProfileRouter");
const updateSiblingProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateSiblingProfileRouter");
const updateAddressProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateAddressprofileRouter");
const addEmergencyContactProfileRouter = require("@MERoutes/studentRouter/studentProfile/addEmergencyContactProfileRouter");
const updateEmergencyContactProfileRouter = require("@MERoutes/studentRouter/studentProfile/updateEmergencyContactProfileRouter");

const router = express.Router();

router.use("/", addParentProfileRouter);
router.use("/", getStudentProfileRouter);
router.use("/", addStudentProfileRouter);
router.use("/", addSiblingProfileRouter);
router.use("/", addAddressProfileRouter);
router.use("/", updateParentProfileRouter);
router.use("/", updateStudentProfileRouter);
router.use("/", updateSiblingProfileRouter);
router.use("/", updateAddressProfileRouter);
router.use("/", addEmergencyContactProfileRouter);
router.use("/", updateEmergencyContactProfileRouter);

module.exports = router;
