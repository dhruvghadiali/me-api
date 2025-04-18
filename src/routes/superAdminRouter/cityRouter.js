const express = require("express");

const { protect } = require("@MEMiddleware/auth");

const router = express.Router();

router.route("/cities").get(protect).post(protect);
router.route("/cities/:id").put(protect).delete(protect);

module.exports = router;
