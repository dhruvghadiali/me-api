const moment = require("moment");
const mongoose = require("mongoose");

const SchoolFee = require("@MEModels/schoolFeeModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const SchoolFeeLog = require("@MEModels/schoolFeeLogModel");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolFeePutRequestFail,
  schoolFeePostRequestFail,
  schoolFeeDeleteRequestFail,
  schoolFeePutRequestSuccess,
  schoolFeePostRequestSuccess,
  schoolFeesGetRequestSuccess,
  schoolFeeDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get school fee
 * @route   GET /school-admin/school-fees
 * @access  School Admin
 */
const getSchoolFees = asyncHandler(async (req, res, next) => {
  const { school_academic_class } = req.params;

  // Find school fees that are is_active status value is true
  const schoolFees = await SchoolFee.find({
    is_active: true,
    school_academic_class: school_academic_class,
  }).populate([
    {
      path: "created_by updated_by",
    },
    { path: "school_academic_class", populate: { path: "academic_class" } },
    { path: "fee_type", select: "fee_type" },
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
      {
        yearly_fee,
        monthly_fee,
        quarterly_fee,
        half_yearly_fee,
        is_active: true,
        updated_by: id,
      },
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

/**
 * @desc    Update school fee
 * @route   PUT /school-admin/school-fees/:id
 * @access  School Admin
 */
const updateSchoolFee = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  const { id } = req.user;

  session.startTransaction();

  // Find school fee that has is_active status value is false
  const schoolFeeInfo = await SchoolFee.findById(req.params.id);

  // If school fee is present and is_active status value is true, create a new school fee log with the user who signin
  if (schoolFeeInfo && schoolFeeInfo.is_active === true) {
    try {
      // Create a new school fee log with the user who signin
      await SchoolFeeLog.create({
        school_academic_class: schoolFeeInfo.school_academic_class,
        fees: [
          {
            fee_type: schoolFeeInfo.fee_type,
            yearly_fee: schoolFeeInfo.yearly_fee,
            monthly_fee: schoolFeeInfo.monthly_fee,
            quarterly_fee: schoolFeeInfo.quarterly_fee,
            half_yearly_fee: schoolFeeInfo.half_yearly_fee,
          },
        ],
        start_date: moment(schoolFeeInfo.created_at, "DD-MM-YYYY").toDate(),
        end_date: moment().toDate(),
        created_by: id,
        updated_by: id,
      });

      // Find school fee id and update school fee with user who signin
      let response = await SchoolFee.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updated_by: id },
        {
          new: true,
          runValidators: true,
        }
      );

      await session.commitTransaction();
      session.endSession();

      // Send response
      res.status(200).json({
        data: [response],
        message: schoolFeePutRequestSuccess,
        status: 200,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      // Send error response
      throw error;
    }
  } else {
    await session.abortTransaction();
    session.endSession();

    // Send error response
    next(new ErrorResponse(schoolFeePutRequestFail, 400));
  }
});

/**
 * @desc    Delete school fee
 * @route   DELETE /school-admin/school-fees/:id
 * @access  School Admin
 */
const deleteSchoolFee = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find school fee id and update is active status to false
  const schoolFeeInfo = await SchoolFee.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (schoolFeeInfo) {
    // Send response
    res.status(200).json({
      data: [],
      message: schoolFeeDeleteRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolFeeDeleteRequestFail, 400));
  }
});

module.exports = {
  addSchoolFee,
  getSchoolFees,
  updateSchoolFee,
  deleteSchoolFee,
};
