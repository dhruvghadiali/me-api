const express = require("express");

const addOrganizationMemberRouter = require("@MERoutes/schoolAdminRouter/organizationMemberRouter/addOrganizationMemberRouter");
const updateOrganizationMemberRouter = require("@MERoutes/schoolAdminRouter/organizationMemberRouter/updateOrganizationMemberRouter");
const deleteOrganizationMemberRouter = require("@MERoutes/schoolAdminRouter/organizationMemberRouter/deleteOrganizationMemberRouter");

const router = express.Router();

router.use("/", addOrganizationMemberRouter);
router.use("/", updateOrganizationMemberRouter);
router.use("/", deleteOrganizationMemberRouter);

module.exports = router;
