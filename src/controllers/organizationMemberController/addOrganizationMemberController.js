const ErrorResponse = require("@MEUtils/errorResponse");
const OrganizationMember = require("@MEModels/organizationMemberModel");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@ME/helpers/enums");
const {
  organizationMemberArrayMaxLength,
} = require("@MEHelpers/validationConst");
const {
  organizationMemberDetailsPostRequestSuccess,
  organizationMemberDetailsPostRequestFail,
  organizationMemberLimitExceeded,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Add a single organization member (max 5 per organization)
 * @route   POST /school-admin/organization-members/:id
 * @access  School Admin
 */
const addOrganizationMember = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { id: organization } = req.params;

  // Check existing active members count for this organization
  const existingMembersCount = await OrganizationMember.countDocuments({
    organization: organization,
    is_active: true,
  });

  if (existingMembersCount >= organizationMemberArrayMaxLength) {
    return next(
      new ErrorResponse(
        organizationMemberLimitExceeded,
        HTTP_STATUS_CODES.STATUS_400,
      ),
    );
  }

  // Insert member with organization reference and audit fields
  const organizationMemberResponse = await OrganizationMember.create({
    ...req.body,
    organization: organization,
    created_by: id,
    updated_by: id,
  });

  if (organizationMemberResponse) {
    await organizationMemberResponse.populate([
      { path: "state", select: "name -_id", transform: (doc) => doc?.name },
      { path: "district", select: "name -_id", transform: (doc) => doc?.name },
      { path: "city", select: "name -_id", transform: (doc) => doc?.name },
      { path: "area_name", select: "name -_id", transform: (doc) => doc?.name },
      {
        path: "zipcode",
        select: "zipcode -_id",
        transform: (doc) => doc?.zipcode,
      },
    ]);

    res.status(HTTP_STATUS_CODES.STATUS_201).json({
      data: [organizationMemberResponse],
      message: organizationMemberDetailsPostRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_201,
    });
  } else {
    next(
      new ErrorResponse(
        organizationMemberDetailsPostRequestFail,
        HTTP_STATUS_CODES.STATUS_400,
      ),
    );
  }
});

module.exports = {
  addOrganizationMember,
};
