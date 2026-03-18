const ErrorResponse = require("@MEUtils/errorResponse");
const OrganizationMember = require("@MEModels/organizationMemberModel");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@ME/helpers/enums");
const {
  organizationMemberDeleteRequestSuccess,
  organizationMemberDeleteRequestFail,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Delete organization member
 * @route   DELETE /school-admin/organization-members/:id
 *          DELETE /super-admin/organization-members/:id
 * @access  School Admin
 */
const deleteOrganizationMember = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find organization member by id and update is_active status to false
  const organizationMemberInfo = await OrganizationMember.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    },
  );

  if (organizationMemberInfo) {
    res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [],
      message: organizationMemberDeleteRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  } else {
    next(
      new ErrorResponse(
        organizationMemberDeleteRequestFail,
        HTTP_STATUS_CODES.STATUS_400,
      ),
    );
  }
});

module.exports = {
  deleteOrganizationMember,
};
