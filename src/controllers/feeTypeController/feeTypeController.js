const FeeType = require("@MEModels/feeTypeModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  feeTypePutRequestFail,
  feeTypePostRequestFail,
  feeTypeDeleteRequestFail,
  feeTypePutRequestSuccess,
  feeTypesGetRequestSuccess,
  feeTypePostRequestSuccess,
  feeTypeDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get all fee types
 * @route   GET /super-admin/fee-types
 *          GET /school-admin/fee-types
 * @access  Super Admin
 *          School Admin
 */
const getFeeTypes = asyncHandler(async (req, res, next) => {
  // Find fee types that are active status and sort them by fee_type
  const feeTypes = await FeeType.find({
    is_active: true,
  })
    .select([
      "fee_type",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by")
    .sort({ fee_type: 1 });

  // Send response
  res.status(200).json({
    data: feeTypes,
    message: feeTypesGetRequestSuccess,
  });
});

/**
 * @desc    Add new fee type
 * @route   POST /super-admin/fee-types
 * @access  Super Admin
 */
const addFeeType = asyncHandler(async (req, res, next) => {
  let response;
  const { fee_type } = req.body;
  const { id } = req.user;

  // Find fee type that is_active status false
  const feeTypeInfo = await FeeType.findOne({
    fee_type: fee_type ? fee_type : "",
    is_active: false,
  });

  if (feeTypeInfo) {
    // If fee type is already present, update the is_active status to true with the user who signin
    response = await FeeType.findByIdAndUpdate(
      feeTypeInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If fee type is not present, create a new fee type with the user who signin
    response = await FeeType.create({
      fee_type,
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
      message: feeTypePostRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(feeTypePostRequestFail, 400));
  }
});

/**
 * @desc    Update fee type
 * @route   PUT /super-admin/fee-types/:id
 * @access  Super Admin
 */
const updateFeeType = asyncHandler(async (req, res, next) => {
  const { fee_type } = req.body;
  const { id } = req.user;

  // Find fee type id and update fee type with user who signin
  const feeTypeInfo = await FeeType.findByIdAndUpdate(
    req.params.id,
    { fee_type, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("created_by updated_by")
    .select([
      "fee_type",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ]);

  // Send response
  if (feeTypeInfo) {
    res.status(200).json({
      data: [feeTypeInfo],
      message: feeTypePutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(feeTypePutRequestFail, 400));
  }
});

/**
 * @desc    Delete fee type
 * @route   DELETE /super-admin/fee-types/:id
 * @access  Super Admin
 */
const deleteFeeType = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find fee type id and update is active status to false
  const feeTypeInfo = await FeeType.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send response
  if (feeTypeInfo) {
    res.status(200).json({
      data: [],
      message: feeTypeDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(feeTypeDeleteRequestFail, 400));
  }
});

module.exports = {
  addFeeType,
  getFeeTypes,
  updateFeeType,
  deleteFeeType,
};
