const AcademicGrade = require("@MEModels/academicGradeModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");

const {
  academicGradePutRequestFail,
  academicGradePostRequestFail,
  academicGradePutRequestSuccess,
  academicGradeDeleteRequestFail,
  academicGradePostRequestSuccess,
  academicGradesGetRequestSuccess,
  academicGradeDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get all academic grades
 * @route   GET /super-admin/academic-grades
 * @access  Super Admin
 */
const getAcademicGrades = asyncHandler(async (req, res, next) => {
  // Find academic grades that are is_active status value is true and sort them by academic_grade
  const academicGrades = await AcademicGrade.find({
    is_active: true,
  })
    .select([
      "academic_grade",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by")
    .sort({ academic_grade: 1 });

  // Send response
  res.status(200).json({
    data: academicGrades,
    message: academicGradesGetRequestSuccess,
  });
});

/**
 * @desc    Add new academic grade
 * @route   POST /super-admin/academic-grades
 * @access  Super Admin
 */
const addAcademicGrade = asyncHandler(async (req, res, next) => {
  let response;
  const { academic_grade } = req.body;
  const { id } = req.user;

  // Find academic_grade that has is_active status value is false
  const academicGradeInfo = await AcademicGrade.findOne({
    academic_grade: academic_grade ? academic_grade : "",
    is_active: false,
  });

  if (academicGradeInfo) {
    // If academic_grade is already present, update the is_active status value to true with the user who signin
    response = await AcademicGrade.findByIdAndUpdate(
      academicGradeInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If academic_grade is not present, create a new academic_grade with the user who signin
    response = await AcademicGrade.create({
      academic_grade,
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
      message: academicGradePostRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(academicGradePostRequestFail, 400));
  }
});

/**
 * @desc    Update academic grade
 * @route   PUT /super-admin/academic-grades/:id
 * @access  Super Admin
 */
const updateAcademicGrade = asyncHandler(async (req, res, next) => {
  const { academic_grade } = req.body;
  const { id } = req.user;

  // Find academic grade id and update academic grade with user who signin
  const academicGradeInfo = await AcademicGrade.findByIdAndUpdate(
    req.params.id,
    { academic_grade, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("created_by updated_by")
    .select([
      "academic_grade",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ]);

  if (academicGradeInfo) {
    // Send response
    res.status(200).json({
      data: [academicGradeInfo],
      message: academicGradePutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(academicGradePutRequestFail, 400));
  }
});

/**
 * @desc    Delete academic grade
 * @route   DELETE /super-admin/academic-grades/:id
 * @access  Super Admin
 */
const deleteAcademicGrade = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find academic grade id and update is active status to false
  const academicGradeInfo = await AcademicGrade.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (academicGradeInfo) {
    // Send response
    res.status(200).json({
      data: [],
      message: academicGradeDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(academicGradeDeleteRequestFail, 400));
  }
});

module.exports = {
  addAcademicGrade,
  getAcademicGrades,
  updateAcademicGrade,
  deleteAcademicGrade,
};
