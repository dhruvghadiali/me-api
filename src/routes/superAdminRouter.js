const express = require("express");
const { testRoute } = require("@MEControllers/testController");


const router = express.Router();

router
    .route("/super-admin-test-route")
    .get(testRoute);

module.exports = router;