const Organization = require("@MEModels/organizationModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  organizationDetailsPutRequestFail,
  organizationDetailsPutRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update organization
 * @route   PUT /super-admin/organizations/:id
 * @access  Super Admin
 */
const updateOrganization = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find organization id and update organization details with user who signin
  const organizationInfo = await Organization.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  ).populate("created_by updated_by");

  if (organizationInfo) {
    // Send response
    res.status(200).json({
      data: [organizationInfo],
      message: organizationDetailsPutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(organizationDetailsPutRequestFail, 400));
  }
});

module.exports = {
  updateOrganization,
};
