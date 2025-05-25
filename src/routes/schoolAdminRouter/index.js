const express = require("express");

const authRouter = require("@MERoutes/schoolAdminRouter/authRouter");

const router = express.Router();

router.use("/", authRouter);

module.exports = router;
