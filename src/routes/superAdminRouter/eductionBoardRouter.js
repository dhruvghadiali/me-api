const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  getEductionBoards,
  addEductionBoard,
  updateEductionBoard,
  deleteEductionBoard,
} = require("@MEControllers/eductionBoardController/eductionBoardController");

const router = express.Router();

router
  .route("/eduction-boards")
  .get(protect, getEductionBoards)
  .post(protect, addEductionBoard);
router
  .route("/eduction-boards/:id")
  .put(protect, updateEductionBoard)
  .delete(protect, deleteEductionBoard);

module.exports = router;
