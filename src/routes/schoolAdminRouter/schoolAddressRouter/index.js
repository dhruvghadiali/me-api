const express = require("express");

const updateSchoolAddressRouter  = require("@MERoutes/schoolAdminRouter/schoolAddressRouter/updateSchoolAddressRouter");

const router = express.Router();

router.use("/", updateSchoolAddressRouter);

module.exports = router;
