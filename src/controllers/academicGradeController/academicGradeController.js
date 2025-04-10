const AcademicGrade = require("@MEModels/academicGradeModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEUtils/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Get all academic grades
 * @route   GET /super-admin/academic-grades
 * @access  Super Admin
 */
exports.getAcademicGrades = asyncHandler(async (req, res, next) => {
  // Find academic grades that are active status and sort them by academic_grade
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
    .populate({
      path: "created_by_user_info",
      select: ["username"],
    })
    .populate({
      path: "updated_by_user_info",
      select: ["username"],
    })
    .sort({ academic_grade: 1 });

  // Send response
  res.status(200).json({
    data: academicGrades,
    message: responseMessage.academicGradesGetRequestSuccess,
  });
});

/**
 * @desc    Add new academic grade
 * @route   POST /super-admin/academic-grades
 * @access  Super Admin
 */
exports.addAcademicGrade = asyncHandler(async (req, res, next) => {
  let response;
  const { academic_grade } = req.body;
  const { id } = req.user;

  // Find academic_grade that is_active status false
  const academicGradeInfo = await AcademicGrade.findOne({
    academic_grade: academic_grade ? academic_grade : "",
    is_active: false,
  });

  if (academicGradeInfo) {
    // If academic_grade is already present, update the is_active status to true with the user who signin
    response = await AcademicGrade.findByIdAndUpdate(
      academicGradeInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If academic_grade is not present, create a new academic grade with the user who signin
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
      message: responseMessage.academicGradePostRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(responseMessage.academicGradePostRequestFail, 400));
  }
});

/**
 * @desc    Update academic grade
 * @route   PUT /super-admin/academic-grades/:id
 * @access  Super Admin
 */
exports.updateAcademicGrade = asyncHandler(async (req, res, next) => {
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
    .populate({
      path: "created_by_user_info",
      select: ["username"],
    })
    .populate({
      path: "updated_by_user_info",
      select: ["username"],
    })
    .select([
      "academic_grade",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ]);

  // Send response
  if (academicGradeInfo) {
    res.status(200).json({
      data: [academicGradeInfo],
      message: responseMessage.academicGradePutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(responseMessage.academicGradePutRequestFail, 400));
  }
});

/**
 * @desc    Delete academic grade
 * @route   DELETE /super-admin/academic-grades/:id
 * @access  Super Admin
 */
exports.deleteAcademicGrade = asyncHandler(async (req, res, next) => {
  // Find academic grade id and update is active status to false
  const academicGradeInfo = await AcademicGrade.findByIdAndUpdate(
    req.params.id,
    { is_active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send response
  if (academicGradeInfo) {
    res.status(200).json({
      data: [],
      message: responseMessage.academicGradeDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(
      new ErrorResponse(responseMessage.academicGradeDeleteRequestFail, 400)
    );
  }
});
