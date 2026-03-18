const express = require("express");

const addOrganizationMemberRouter = require("@MERoutes/schoolAdminRouter/organizationMemberRouter/addOrganizationMemberRouter");
const deleteOrganizationMemberRouter = require("@MERoutes/schoolAdminRouter/organizationMemberRouter/deleteOrganizationMemberRouter");

const router = express.Router();

router.use("/", addOrganizationMemberRouter);
router.use("/", deleteOrganizationMemberRouter);

module.exports = router;
