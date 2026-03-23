const SchoolAddress = require("@MEModels/schoolAddressModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolAddressDetailsPutRequestFail,
  schoolAddressDetailsPutRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update school address
 * @route   PUT /super-admin/school-addresses/:id
 *          PUT /school-admin/school-addresses/:id
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
    },
  ).populate("created_by updated_by");

  if (schoolAddressInfo) {
    await schoolAddressInfo.populate([
      { path: "state", select: ["name"] },
      { path: "district", select: ["name"] },
      { path: "city", select: ["name"] },
      { path: "area_name", select: ["name"] },
      { path: "zipcode", select: ["zipcode"] },
    ]);
    
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

module.exports = {
  updateSchoolAddress,
};
