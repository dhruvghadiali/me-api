const OrganizationMember = require("@MEModels/organizationMemberModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  organizationMemberDeleteRequestFail,
  organizationMemberDeleteRequestSuccess,
  organizationMemberDetailsPutRequestFail,
  organizationMemberDetailsPutRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Update organization member
 * @route   PUT /super-admin/organization-members/:id
 * @access  Super Admin
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

/**
 * @desc    Delete organization member
 * @route   DELETE /super-admin/organization-members/:id
 * @access  Super Admin
 */
const deleteOrganizationMember = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find organization member id and update is active status to false
  const organizationMemberInfo = await OrganizationMember.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (organizationMemberInfo) {
    // Send response
    res.status(200).json({
      data: [],
      message: organizationMemberDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(organizationMemberDeleteRequestFail, 400));
  }
});

module.exports = {
  updateOrganizationMember,
  deleteOrganizationMember,
};
