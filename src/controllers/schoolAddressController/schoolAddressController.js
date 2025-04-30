const User = require("@MEModels/userModel");
const SchoolAddress = require("@MEModels/schoolAddressModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolAddressDeleteRequestSuccess,
  schoolAddressDetailsPutRequestFail,
  schoolAddressDetailsPutRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update school address
 * @route   PUT /super-admin/school-addresses/:id
 * @access  Super Admin
 */
const updateSchoolAddress = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find school address id and update school address details with user who signin
  const schoolAddressInfo = await SchoolAddress.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  ).populate("created_by updated_by");

  if (schoolAddressInfo) {
    // Send response
    res.status(200).json({
      data: [schoolAddressInfo],
      message: schoolAddressDetailsPutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAddressDetailsPutRequestFail, 400));
  }
});

/**
 * @desc    Delete school address
 * @route   DELETE /super-admin/school-addresses/:id
 * @route   PATCH /super-admin/school-addresses/:id
 * @access  Super Admin
 */
const changeSchoolAddressStatus = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { id } = req.user;
  const { status } = req.body;

  try {
    // Find school address id and update is active status to false
    const schoolAddressInfo = await SchoolAddress.findByIdAndUpdate(
      req.params.id,
      { is_active: status, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );

    if (schoolAddressInfo) {
      // Find user id and update is active status to false
      await User.findByIdAndUpdate(
        schoolAddressInfo.user,
        { is_active: status, is_account_verified: status },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // Send response
    res.status(200).json({
      data: [],
      message: schoolAddressDeleteRequestSuccess,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Send error response
    throw error;
  }
});

module.exports = {
  updateSchoolAddress,
  changeSchoolAddressStatus,
};
