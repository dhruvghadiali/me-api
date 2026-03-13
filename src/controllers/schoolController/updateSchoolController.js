const School = require("@MEModels/schoolModel");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolAboutPutRequestFail,
  schoolAboutPutRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update school
 * @route   PATCH /school-admin/school-about/:id
 * @access  School Admin
 */
const updateSchoolAboutInformation = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { about } = req.body;

  // Find school id and update school details with user who signin
  const schoolInfo = await School.findByIdAndUpdate(
    req.params.id,
    { about, updated_by: id },
    {
      new: true,
      runValidators: true,
    },
  ).populate("created_by updated_by");

  if (schoolInfo) {
    // Send response
    res.status(200).json({
      data: [schoolInfo],
      message: schoolAboutPutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAboutPutRequestFail, 400));
  }
});

module.exports = {
  updateSchoolAboutInformation,
};
