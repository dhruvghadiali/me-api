const School = require("@MEModels/schoolModel");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const { schoolsGetRequestSuccess } = require("@MEHelpers/responseMessage");

/**
 * @desc    Get all schools
 * @route   GET /students/school-academic-classes
 * @access  Public
 */
const getSchoolAcademicClasses = asyncHandler(async (req, res, next) => {
  // Find schools that are is_active status value is true and sort them by name
  const schools = await School.find({
    is_active: req.query.is_active || true,
  })
    .select(["name"])
    .populate([
      {
        path: "school_academic_class",
        select: "education_board academic_class",
        populate: [{ path: "academic_class", select: "academic_class" }],
      },
    ])
    .sort({ name: 1 });

  // Send response
  res.status(HTTP_STATUS_CODES.STATUS_200).json({
    data: schools,
    message: schoolsGetRequestSuccess,
    status: HTTP_STATUS_CODES.STATUS_200,
  });
});

module.exports = {
  getSchoolAcademicClasses,
};
