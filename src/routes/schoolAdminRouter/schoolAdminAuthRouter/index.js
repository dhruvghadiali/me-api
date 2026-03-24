const express = require("express");

const schoolAdminSigninRouter = require("@ME/routes/schoolAdminRouter/schoolAdminAuthRouter/schoolAdminSigninRouter");
const updateSchoolAdminPasswordRouter = require("@MERoutes/schoolAdminRouter/schoolAdminAuthRouter/updateSchoolAdminPasswordRouter");
const updateSchoolAdminUsernameRouter = require("@MERoutes/schoolAdminRouter/schoolAdminAuthRouter/updateSchoolAdminUsernameRouter");

const router = express.Router();

router.use("/", schoolAdminSigninRouter);
router.use("/", updateSchoolAdminPasswordRouter);
router.use("/", updateSchoolAdminUsernameRouter);

module.exports = router;
