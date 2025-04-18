const express = require("express");

const { protect } = require("@MEMiddleware/auth");

const router = express.Router();

router.route("/schools").get(protect).post(protect);
router
  .route("/schools/:id")
  .get(protect) // provide all the address with is_active front will handle the address
  .put(protect)
  .patch(protect)
  .delete(protect);

module.exports = router;
