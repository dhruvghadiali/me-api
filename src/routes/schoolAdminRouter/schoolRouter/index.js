const express = require("express");

const updateSchoolAboutRouter = require("@MERoutes/schoolAdminRouter/schoolRouter/updateSchoolAboutRouter");

const router = express.Router();

router.use("/", updateSchoolAboutRouter);

module.exports = router;
