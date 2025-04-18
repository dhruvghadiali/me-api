const express = require("express");

const { protect } = require("@MEMiddleware/auth");

const router = express.Router();

router.route("/districts").get(protect).post(protect);
router.route("/districts/:id").put(protect).delete(protect);

module.exports = router;
