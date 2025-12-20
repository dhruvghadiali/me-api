const express = require("express");

const addAdmissionApplicationRouter = require("@MERoutes/studentRouter/admissionApplicationRouter/addAdmissionApplicationRouter");
const getAdmissionApplicationsRouter = require("@MERoutes/studentRouter/admissionApplicationRouter/getAdmissionApplicationsRouter");
const updateAdmissionApplicationStatusRouter = require("@MERoutes/studentRouter/admissionApplicationRouter/updateAdmissionApplicationStatusRouter");

const router = express.Router();

router.use("/", addAdmissionApplicationRouter);
router.use("/", getAdmissionApplicationsRouter);
router.use("/", updateAdmissionApplicationStatusRouter);

module.exports = router;
