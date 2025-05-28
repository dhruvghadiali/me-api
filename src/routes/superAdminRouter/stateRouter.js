const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
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
  .get(superAdminProtect, getStates)
  .post(superAdminProtect, validateStatesPostReqBody, addState);
router
  .route("/states/:id")
  .put(
    superAdminProtect,
    validateStatesQueryParams,
    validateStatesPutReqBody,
    updateState
  )
  .delete(superAdminProtect, validateStatesQueryParams, deleteState);

module.exports = router;
