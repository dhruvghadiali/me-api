const express = require("express");

const { protect } = require("@MEMiddleware/auth");

const router = express.Router();

router.route("/zipcodes").get(protect).post(protect);
router.route("/zipcodes/:id").put(protect).delete(protect);

module.exports = router;
