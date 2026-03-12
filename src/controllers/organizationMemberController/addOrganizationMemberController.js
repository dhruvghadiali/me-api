const _ = require("lodash");

const ErrorResponse = require("@MEUtils/errorResponse");
const OrganizationMember = require("@MEModels/organizationMemberModel");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@ME/helpers/enums");
const { organizationMemberArrayMaxLength } = require("@MEHelpers/validationConst");
const {
  organizationMemberDetailsPostRequestSuccess,
  organizationMemberDetailsPostRequestFail,
  organizationMemberLimitExceeded,
  organizationMemberLimitWillExceed,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Add multiple organization members (max 5 per organization)
 * @route   POST /school-admin/organization-members/:organizationId
 * @access  School Admin
 */
const addOrganizationMember = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { organizationId } = req.params;
  const members = req.body;

  // Check existing active members count for this organization
  const existingMembersCount = await OrganizationMember.countDocuments({
    organization: organizationId,
    is_active: true,
  });

  if (existingMembersCount >= organizationMemberArrayMaxLength) {
    return next(
      new ErrorResponse(
        organizationMemberLimitExceeded,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Check if adding new members would exceed the limit
  const totalAfterAdd = existingMembersCount + _.size(members);
  if (totalAfterAdd > organizationMemberArrayMaxLength) {
    return next(
      new ErrorResponse(
        organizationMemberLimitWillExceed(
          _.size(members),
          existingMembersCount,
          organizationMemberArrayMaxLength
        ),
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Insert members with organization reference and audit fields
  const organizationMembersResponse = await OrganizationMember.insertMany(
    _.map(members, (member) => ({
      ...member,
      organization: organizationId,
      created_by: id,
      updated_by: id,
    }))
  );

  if (!_.isEmpty(organizationMembersResponse)) {
    res.status(HTTP_STATUS_CODES.STATUS_201).json({
      data: organizationMembersResponse,
      message: organizationMemberDetailsPostRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_201,
    });
  } else {
    next(
      new ErrorResponse(
        organizationMemberDetailsPostRequestFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }
});

module.exports = {
  addOrganizationMember,
};
