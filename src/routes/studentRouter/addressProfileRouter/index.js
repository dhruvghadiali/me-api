const express = require("express");

const addAddressProfileRouter = require("@MERoutes/studentRouter/addressProfileRouter/addAddressProfileRouter");

const router = express.Router();

router.use("/", addAddressProfileRouter);

module.exports = router;
