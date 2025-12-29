const _ = require("lodash");

const ErrorResponse = require("@MEUtils/errorResponse");
const StudentProfile = require("@MEModels/studentProfileModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  studentProfileDetailsRequired,
  studentProfileDetailsPostRequestFail,
  studentProfileDetailsPostRequestSuccess,
} = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Create new student profile for user
 * @route   POST /student/profile
 * @access  Student
 */
const addStudentProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Validate request body is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse(
        studentProfileDetailsRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Create new student profile document with data from req.body
  const newStudentProfile = await StudentProfile.create({
    ...req.body,
    user: id, // Assuming user is attached to request by auth middleware
    created_by: id,
    updated_by: id,
  });

  // Populate references for response
  const populatedStudentProfile = await newStudentProfile.populate([
    { path: "user" },
  ]);

  if (!populatedStudentProfile) {
    // Send failure response
    return next(
      new ErrorResponse(
        studentProfileDetailsPostRequestFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Send success response
  return res.status(HTTP_STATUS_CODES.STATUS_201).json({
    data: [populatedStudentProfile],
    message: studentProfileDetailsPostRequestSuccess,
    status: HTTP_STATUS_CODES.STATUS_201,
  });
});

module.exports = { addStudentProfile };
