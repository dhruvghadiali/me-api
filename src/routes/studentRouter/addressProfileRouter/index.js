const express = require("express");

const addAddressProfileRouter = require("@MERoutes/studentRouter/addressProfileRouter/addAddressProfileRouter");
const updatedAddressProfileRouter = require("@MERoutes/studentRouter/addressProfileRouter/updateAddressProfileRouter");

const router = express.Router();

router.use("/", addAddressProfileRouter);
router.use("/", updatedAddressProfileRouter);

module.exports = router;
