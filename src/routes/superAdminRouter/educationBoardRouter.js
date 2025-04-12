const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  getEducationBoards,
  addEducationBoard,
  updateEducationBoard,
  deleteEducationBoard,
} = require("@MEControllers/educationBoardController/educationBoardController");

const router = express.Router();

router
  .route("/education-boards")
  .get(protect, getEducationBoards)
  .post(protect, addEducationBoard);
router
  .route("/education-boards/:id")
  .put(protect, updateEducationBoard)
  .delete(protect, deleteEducationBoard);

module.exports = router;
