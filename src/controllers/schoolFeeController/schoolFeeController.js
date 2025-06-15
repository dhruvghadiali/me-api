const SchoolFee = require("@MEModels/schoolFeeModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolFeePostRequestFail,
  schoolFeePostRequestSuccess,
  schoolFeesGetRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get school fee
 * @route   GET /school-admin/school-fees
 * @access  School Admin
 */
const getSchoolFees = asyncHandler(async (req, res, next) => {
  const { academic_class } = req.params;

  // Find school fees that are is_active status value is true
  const schoolFees = await SchoolFee.find({
    is_active: true,
    school_academic_class: academic_class,
  }).populate([
    {
      path: "created_by updated_by",
    },
    { path: "academic_class", select: "academic_class" },
  ]);

  // Send response
  res.status(200).json({
    data: schoolFees,
    message: schoolFeesGetRequestSuccess,
    status: 200,
  });
});

/**
 * @desc    Add new school fee
 * @route   POST /school-admin/school-fees
 * @access  School Admin
 */
const addSchoolFee = asyncHandler(async (req, res, next) => {
  let response;
  const {
    fee_type,
    yearly_fee,
    monthly_fee,
    quarterly_fee,
    half_yearly_fee,
    school_academic_class,
  } = req.body;
  const { id } = req.user;

  // Find school fee that has is_active status value is false
  const schoolFeeInfo = await SchoolFee.findOne({
    school_academic_class: school_academic_class ? school_academic_class : "",
    fee_type: fee_type ? fee_type : "",
    is_active: false,
  });

  if (schoolFeeInfo && schoolFeeInfo.id && schoolFeeInfo.is_active === false) {
    // If school fee is already present, update the is_active status value to true with the user who signin
    response = await SchoolFee.findByIdAndUpdate(
      schoolFeeInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If school fee is not present, create a new school fee with the user who signin
    response = await SchoolFee.create({
      fee_type,
      yearly_fee,
      monthly_fee,
      quarterly_fee,
      half_yearly_fee,
      school_academic_class,
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
      message: schoolFeePostRequestSuccess,
      status: 201,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolFeePostRequestFail, 400));
  }
});

module.exports = {
  addSchoolFee,
  getSchoolFees,
};
