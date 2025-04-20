const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addState,
  getStates,
  updateState,
  deleteState,
} = require("@MEControllers/stateController/stateController");

const router = express.Router();

router.route("/states").get(protect, getStates).post(protect, addState);
router
  .route("/states/:id")
  .put(protect, updateState)
  .delete(protect, deleteState);

module.exports = router;
