const express = require("express");

const { protect } = require("@MEMiddleware/auth");

const router = express.Router();

router.route("/admission-document-types").get(protect).post(protect);
router.route("/admission-document-types/:id").put(protect).delete(protect);

module.exports = router;
