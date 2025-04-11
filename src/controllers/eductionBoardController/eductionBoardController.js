const EductionBoard = require("@MEModels/eductionBoardModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEUtils/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Get all education boards
 * @route   GET /super-admin/education-boards
 * @access  Super Admin
 */
exports.getEductionBoards = asyncHandler(async (req, res, next) => {
  // Find eduction boards that are active status and sort them by eduction_board
  const eductionBoards = await EductionBoard.find({
    is_active: true,
  })
    .select([
      "eduction_board",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate({
      path: "created_by_user_info",
      select: ["username"],
    })
    .populate({
      path: "updated_by_user_info",
      select: ["username"],
    })
    .sort({ eduction_board: 1 });

  // Send response
  res.status(200).json({
    data: eductionBoards,
    message: responseMessage.eductionBoardGetRequestSuccess,
  });
});

/**
 * @desc    Add new education board
 * @route   POST /super-admin/education-boards
 * @access  Super Admin
 */
exports.addEductionBoard = asyncHandler(async (req, res, next) => {
  let response;
  const { eduction_board } = req.body;
  const { id } = req.user;

  // Find eduction board that is_active status false
  const eductionBoardInfo = await EductionBoard.findOne({
    eduction_board: eduction_board ? eduction_board : "",
    is_active: false,
  });

  if (eductionBoardInfo) {
    // If eduction board is already present, update the is_active status to true with the user who signin
    response = await EductionBoard.findByIdAndUpdate(
      eductionBoardInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If eduction board is not present, create a new eduction board with the user who signin
    response = await EductionBoard.create({
      eduction_board,
      created_by: id,
      updated_by: id,
    });
  }

  // If response is present, remove the unused property from the response and populate the created_by and updated_by username
  if (response) {
    delete response._doc.is_active;
    delete response._doc.__v;

    // Populate the created_by and updated_by username
    await response.populate([
      {
        path: "created_by_user_info",
        select: ["username"],
      },
      {
        path: "updated_by_user_info",
        select: ["username"],
      },
    ]);

    // Send response
    res.status(201).json({
      data: [response],
      message: responseMessage.eductionBoardPostRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(responseMessage.eductionBoardPostRequestFail, 400));
  }
});

/**
 * @desc    Update eduction board
 * @route   PUT /super-admin/education-boards/:id
 * @access  Super Admin
 */
exports.updateEductionBoard = asyncHandler(async (req, res, next) => {
  const { eduction_board } = req.body;
  const { id } = req.user;

  // Find eduction board id and update eduction board with user who signin
  const eductionBoardInfo = await EductionBoard.findByIdAndUpdate(
    req.params.id,
    { eduction_board, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({
      path: "created_by_user_info",
      select: ["username"],
    })
    .populate({
      path: "updated_by_user_info",
      select: ["username"],
    })
    .select([
      "eduction_board",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ]);

  // Send response
  if (eductionBoardInfo) {
    res.status(200).json({
      data: [eductionBoardInfo],
      message: responseMessage.eductionBoardPutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(responseMessage.eductionBoardPutRequestFail, 400));
  }
});

/**
 * @desc    Delete eduction board
 * @route   DELETE /super-admin/education-boards/:id
 * @access  Super Admin
 */
exports.deleteEductionBoard = asyncHandler(async (req, res, next) => {
  // Find eduction board id and update is active status to false
  const educationBoardInfo = await EductionBoard.findByIdAndUpdate(
    req.params.id,
    { is_active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send response
  if (educationBoardInfo) {
    res.status(200).json({
      data: [],
      message: responseMessage.eductionBoardDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(
      new ErrorResponse(responseMessage.eductionBoardDeleteRequestFail, 400)
    );
  }
});
