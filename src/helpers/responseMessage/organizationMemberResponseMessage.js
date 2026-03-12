const organizationMemberResponseMessage = {
  organizationMemberDetailsRequired: `Organization members details are required`,
  organizationMemberDetailsPostRequestSuccess: `Organization member details added successfully`,
  organizationMemberDetailsPostRequestFail: `Facing issue while adding organization member details`,
  organizationMemberDetailsPutRequestSuccess: `Organization member details updated successfully`,
  organizationMemberDetailsPutRequestFail: `Facing issue while updating organization member details`,
  organizationMemberDeleteRequestSuccess: `Organization member details deleted successfully`,
  organizationMemberDeleteRequestFail: `Facing issue while deleting organization member details`,
  organizationMemberLimitExceeded: `Organization already has the maximum of 5 members. Cannot add more members`,
  organizationMemberLimitWillExceed: (membersCount, existingCount, maxLimit) =>
    `Cannot add ${membersCount} members. Organization already has ${existingCount} member(s). Maximum allowed is ${maxLimit}`,
};

module.exports = organizationMemberResponseMessage;
