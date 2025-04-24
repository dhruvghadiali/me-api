const EducationBoard = require("@MEModels/educationBoardModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  educationBoardPutRequestFail,
  educationBoardPostRequestFail,
  educationBoardDeleteRequestFail,
  educationBoardPutRequestSuccess,
  educationBoardGetRequestSuccess,
  educationBoardPostRequestSuccess,
  educationBoardDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get all education boards
 * @route   GET /super-admin/education-boards
 * @access  Super Admin
 */
const getEducationBoards = asyncHandler(async (req, res, next) => {
  // Find education boards that are active status and sort them by education_board
  const educationBoards = await EducationBoard.find({
    is_active: true,
  })
    .select([
      "education_board",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by")
    .sort({ education_board: 1 });

  // Send response
  res.status(200).json({
    data: educationBoards,
    message: educationBoardGetRequestSuccess,
  });
});

/**
 * @desc    Add new education board
 * @route   POST /super-admin/education-boards
 * @access  Super Admin
 */
const addEducationBoard = asyncHandler(async (req, res, next) => {
  let response;
  const { education_board } = req.body;
  const { id } = req.user;

  // Find education board that is_active status false
  const educationBoardInfo = await EducationBoard.findOne({
    education_board: education_board ? education_board : "",
    is_active: false,
  });

  if (educationBoardInfo) {
    // If education board is already present, update the is_active status to true with the user who signin
    response = await EducationBoard.findByIdAndUpdate(
      educationBoardInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If education board is not present, create a new education board with the user who signin
    response = await EducationBoard.create({
      education_board,
      created_by: id,
      updated_by: id,
    });
  }

  // If response is present, remove the unused property from the response and populate the created_by and updated_by username
  if (response) {
    delete response._doc.is_active;
    delete response._doc.__v;

    // Populate the created_by and updated_by username
    await response.populate("created_by updated_by");

    // Send response
    res.status(201).json({
      data: [response],
      message: educationBoardPostRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(educationBoardPostRequestFail, 400));
  }
});

/**
 * @desc    Update education board
 * @route   PUT /super-admin/education-boards/:id
 * @access  Super Admin
 */
const updateEducationBoard = asyncHandler(async (req, res, next) => {
  const { education_board } = req.body;
  const { id } = req.user;

  // Find education board id and update education board with user who signin
  const educationBoardInfo = await EducationBoard.findByIdAndUpdate(
    req.params.id,
    { education_board, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("created_by updated_by")
    .select([
      "education_board",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ]);

  // Send response
  if (educationBoardInfo) {
    res.status(200).json({
      data: [educationBoardInfo],
      message: educationBoardPutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(educationBoardPutRequestFail, 400));
  }
});

/**
 * @desc    Delete education board
 * @route   DELETE /super-admin/education-boards/:id
 * @access  Super Admin
 */
const deleteEducationBoard = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find education board id and update is active status to false
  const educationBoardInfo = await EducationBoard.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send response
  if (educationBoardInfo) {
    res.status(200).json({
      data: [],
      message: educationBoardDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(educationBoardDeleteRequestFail, 400));
  }
});

module.exports = {
  addEducationBoard,
  getEducationBoards,
  updateEducationBoard,
  deleteEducationBoard,
};
