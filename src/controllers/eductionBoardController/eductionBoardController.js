const EductionBoard = require("@MEModels/eductionBoardModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEUtils/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

exports.getEductionBoards = asyncHandler(async (req, res, next) => {
  const EductionBoards = await EductionBoard.find({
    is_active: true,
  })
    .select(["eduction_board_name", "created_at", "updated_at"])
    .sort({ eduction_board_name: 1 });

  res.status(200).json({
    data: EductionBoards,
    message: responseMessage.eductionBoardGetRequestSuccess,
  });
});

exports.addEductionBoard = asyncHandler(async (req, res, next) => {
  let response;
  const { eduction_board_name } = req.body;

  const eductionBoardInfo = await EductionBoard.findOne({
    eduction_board_name: eduction_board_name ? eduction_board_name : "",
    is_active: false,
  });

  if (eductionBoardInfo) {
    response = await EductionBoard.findByIdAndUpdate(
      eductionBoardInfo.id,
      { is_active: true },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    response = await EductionBoard.create({ eduction_board_name });
  }

  if (response) {
    delete response._doc.is_active;
    delete response._doc.__v;

    res.status(201).json({
      data: [response],
      message: responseMessage.eductionBoardPostRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.eductionBoardPostRequestFail, 400));
  }
});

exports.updateEductionBoard = asyncHandler(async (req, res, next) => {
  const eductionBoardInfo = await EductionBoard.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select(["eduction_board_name", "created_at", "updated_at"]);

  if (eductionBoardInfo) {
    res.status(200).json({
      data: [eductionBoardInfo],
      message: responseMessage.eductionBoardPutRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.eductionBoardPutRequestFail, 400));
  }
});

exports.deleteEductionBoard = asyncHandler(async (req, res, next) => {
  const eductionBoardInfo = await EductionBoard.findByIdAndUpdate(
    req.params.id,
    { is_active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  if (eductionBoardInfo) {
    res.status(200).json({
      data: [],
      message: responseMessage.eductionBoardDeleteRequestSuccess,
    });
  } else {
    next(
      new ErrorResponse(responseMessage.eductionBoardDeleteRequestFail, 400)
    );
  }
});
