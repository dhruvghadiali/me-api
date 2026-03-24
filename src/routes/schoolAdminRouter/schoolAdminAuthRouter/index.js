const express = require("express");

const schoolAdminSigninRouter = require("@ME/routes/schoolAdminRouter/schoolAdminAuthRouter/schoolAdminSigninRouter");

const router = express.Router();

router.use("/", schoolAdminSigninRouter);

module.exports = router;
