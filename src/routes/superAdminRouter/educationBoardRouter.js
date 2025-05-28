const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  getEducationBoards,
  addEducationBoard,
  updateEducationBoard,
  deleteEducationBoard,
} = require("@MEControllers/educationBoardController/educationBoardController");
const {
  validateEducationBoardsPutReqBody,
  validateEducationBoardsPostReqBody,
  validateEducationBoardsQueryParams,
} = require("@MEControllers/educationBoardController/eductionBoardValidation");

const router = express.Router();

router
  .route("/education-boards")
  .get(superAdminProtect, getEducationBoards)
  .post(
    superAdminProtect,
    validateEducationBoardsPostReqBody,
    addEducationBoard
  );
router
  .route("/education-boards/:id")
  .put(
    superAdminProtect,
    validateEducationBoardsQueryParams,
    validateEducationBoardsPutReqBody,
    updateEducationBoard
  )
  .delete(
    superAdminProtect,
    validateEducationBoardsQueryParams,
    deleteEducationBoard
  );

module.exports = router;
