const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");

const {
  schoolAcademicClassPostRequestFail,
  schoolAcademicClassDeleteRequestFail,
  schoolAcademicClassPostRequestSuccess,
  schoolAcademicClassesGetRequestSuccess,
  schoolAcademicClassDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get all school academic classes
 * @route   GET /school-admin/school-academic-classes
 * @access  School Admin
 */
const getSchoolAcademicClasses = asyncHandler(async (req, res, next) => {
  const { school, education_board } = req.params;
  // Find school academic classes that are is_active status value is true and sort by academic_class
  const schoolAcademicClasses = await SchoolAcademicClass.find({
    is_active: true,
    school: school,
    education_board: education_board,
  }).populate([
    {
      path: "created_by updated_by",
    },
    { path: "academic_class", select: "academic_class" },
    { path: "education_board", select: "education_board" },
  ]);

  // Send response
  res.status(200).json({
    data: schoolAcademicClasses,
    message: schoolAcademicClassesGetRequestSuccess,
    status: 200,
  });
});

/**
 * @desc    Add new school academic class
 * @route   POST /school-admin/school-academic-classes
 * @access  School Admin
 */
const addSchoolAcademicClass = asyncHandler(async (req, res, next) => {
  let response;
  const { academic_class, education_board, school } = req.body;
  const { id } = req.user;

  // Find school_academic_class that has is_active status value is false
  const schoolAcademicClassInfo = await SchoolAcademicClass.findOne({
    school: school ? school : "",
    education_board: education_board ? education_board : "",
    academic_class: academic_class ? academic_class : "",
    is_active: false,
  });

  if (schoolAcademicClassInfo) {
    // If school_academic_class is already present, update the is_active status value to true with the user who signin
    response = await SchoolAcademicClass.findByIdAndUpdate(
      schoolAcademicClassInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If school_academic_class is not present, create a new school_academic_class with the user who signin
    response = await SchoolAcademicClass.create({
      school,
      education_board,
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
      message: schoolAcademicClassPostRequestSuccess,
      status: 201,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAcademicClassPostRequestFail, 400));
  }
});

/**
 * @desc    Delete school academic class
 * @route   DELETE /school-admin/school-academic-classes/:id
 * @access  School Admin
 */
const deleteSchoolAcademicClass = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find school academic class id and update is active status to false
  const schoolAcademicClassInfo = await SchoolAcademicClass.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (schoolAcademicClassInfo) {
    // Send response
    res.status(200).json({
      data: [],
      message: schoolAcademicClassDeleteRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAcademicClassDeleteRequestFail, 400));
  }
});

module.exports = {
  addSchoolAcademicClass,
  getSchoolAcademicClasses,
  deleteSchoolAcademicClass,
};
