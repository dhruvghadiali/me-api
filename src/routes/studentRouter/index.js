const express = require("express");

const authRouter = require("@MERoutes/studentRouter/authRouter");

const router = express.Router();

router.use("/", authRouter);

module.exports = router;
