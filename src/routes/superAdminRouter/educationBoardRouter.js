const express = require("express");

const { protect } = require("@MEMiddleware/auth");
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
  .get(protect, getEducationBoards)
  .post(protect, validateEducationBoardsPostReqBody, addEducationBoard);
router
  .route("/education-boards/:id")
  .put(
    protect,
    validateEducationBoardsQueryParams,
    validateEducationBoardsPutReqBody,
    updateEducationBoard
  )
  .delete(protect, validateEducationBoardsQueryParams, deleteEducationBoard);

module.exports = router;
