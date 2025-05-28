const AcademicClass = require("@MEModels/academicClassModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");

const {
  academicClassPutRequestFail,
  academicClassPostRequestFail,
  academicClassPutRequestSuccess,
  academicClassDeleteRequestFail,
  academicClassPostRequestSuccess,
  academicClassesGetRequestSuccess,
  academicClassDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get all academic classes
 * @route   GET /super-admin/academic-grades
 * @access  Super Admin
 */
const getAcademicClasses = asyncHandler(async (req, res, next) => {
  // Find academic classes that are is_active status value is true and sort them by academic_class
  const academicClasses = await AcademicClass.find({
    is_active: true,
  })
    .select([
      "academic_class",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by")
    .sort({ academic_class: 1 });

  // Send response
  res.status(200).json({
    data: academicClasses,
    message: academicClassesGetRequestSuccess,
    status: 200,
  });
});

/**
 * @desc    Add new academic class
 * @route   POST /super-admin/academic-classes
 * @access  Super Admin
 */
const addAcademicClass = asyncHandler(async (req, res, next) => {
  let response;
  const { academic_class } = req.body;
  const { id } = req.user;

  // Find academic_class that has is_active status value is false
  const academicClassInfo = await AcademicClass.findOne({
    academic_class: academic_class ? academic_class : "",
    is_active: false,
  });

  if (academicClassInfo) {
    // If academic_class is already present, update the is_active status value to true with the user who signin
    response = await AcademicClass.findByIdAndUpdate(
      academicClassInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If academic_class is not present, create a new academic_class with the user who signin
    response = await AcademicClass.create({
      academic_class,
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
      message: academicClassPostRequestSuccess,
      status: 201,
    });
  } else {
    // Send error response
    next(new ErrorResponse(academicClassPostRequestFail, 400));
  }
});

/**
 * @desc    Update academic class
 * @route   PUT /super-admin/academic-classes/:id
 * @access  Super Admin
 */
const updateAcademicClass = asyncHandler(async (req, res, next) => {
  const { academic_class } = req.body;
  const { id } = req.user;

  // Find academic class id and update academic class with user who signin
  const academicClassInfo = await AcademicClass.findByIdAndUpdate(
    req.params.id,
    { academic_class, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("created_by updated_by")
    .select([
      "academic_class",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ]);

  if (academicClassInfo) {
    // Send response
    res.status(200).json({
      data: [academicClassInfo],
      message: academicClassPutRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(academicClassPutRequestFail, 400));
  }
});

/**
 * @desc    Delete academic class
 * @route   DELETE /super-admin/academic-classes/:id
 * @access  Super Admin
 */
const deleteAcademicClass = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find academic class id and update is active status to false
  const academicClassInfo = await AcademicClass.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (academicClassInfo) {
    // Send response
    res.status(200).json({
      data: [],
      message: academicClassDeleteRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(academicClassDeleteRequestFail, 400));
  }
});

module.exports = {
  addAcademicClass,
  getAcademicClasses,
  updateAcademicClass,
  deleteAcademicClass,
};
