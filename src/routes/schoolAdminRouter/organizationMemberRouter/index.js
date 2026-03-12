const express = require("express");

const addOrganizationMemberRouter = require("@MERoutes/schoolAdminRouter/organizationMemberRouter/addOrganizationMemberRouter");

const router = express.Router();

router.use("/", addOrganizationMemberRouter);

module.exports = router;
