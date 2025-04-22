const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addState,
  getStates,
  updateState,
  deleteState,
} = require("@MEControllers/stateController/stateController");
const {
  validateStatesPutReqBody,
  validateStatesPostReqBody,
  validateStatesQueryParams,
} = require("@MEControllers/stateController/stateValidation");

const router = express.Router();

router
  .route("/states")
  .get(protect, getStates)
  .post(protect, validateStatesPostReqBody, addState);
router
  .route("/states/:id")
  .put(
    protect,
    validateStatesQueryParams,
    validateStatesPutReqBody,
    updateState
  )
  .delete(protect, validateStatesQueryParams, deleteState);

module.exports = router;
