const OrganizationMember = require("@MEModels/organizationMemberModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  organizationMemberDetailsPutRequestFail,
  organizationMemberDetailsPutRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update organization member details
 * @route   PUT /super-admin/organization-members/:id
 *          PUT /school-admin/organization-members/:id
 * @access  Super Admin
 * @param   {Object} req - Express request object containing the organization member details in the body and user ID in the user object.
 * @param   {Object} res - Express response object used to send the response.
 * @param   {Function} next - Express middleware function for error handling.
 */
const updateOrganizationMember = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find organization member id and update organization member details with user who signin
  const organizationMemberInfo = await OrganizationMember.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  ).populate("created_by updated_by");

  if (organizationMemberInfo) {
    // Send response
    res.status(200).json({
      data: [organizationMemberInfo],
      message: organizationMemberDetailsPutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(organizationMemberDetailsPutRequestFail, 400));
  }
});


module.exports = {
  updateOrganizationMember,
};
