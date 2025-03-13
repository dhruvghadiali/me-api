const express = require("express");
const { testRoute } = require("../controller/testController");


const router = express.Router();

router
    .route("/student-admin-test-route")
    .get(testRoute);

module.exports = router;