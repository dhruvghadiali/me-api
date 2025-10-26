const express = require("express");

const updateAdmissionApplicationStatusRouter = require("@MERoutes/schoolAdminRouter/admissionApplicationRouter/updateAdmissionApplicationStatusRouter");

const router = express.Router();

router.use("/", updateAdmissionApplicationStatusRouter);

module.exports = router;
