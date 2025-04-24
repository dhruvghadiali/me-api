const {
  organizationMemberArrayLength,
  organizationMemberPositionMinChar,
  organizationMemberPositionMaxChar,
} = require("@MEHelpers/validationConst");

const organizationMemberValidationMessage = {
  organizationMemberPositionRequired: "Member position is required",
  organizationMemberPositionEmpty: `Member position cannot be empty`,
  organizationMemberPositionInvalidFormate: `Member position must be string formate`,
  organizationMemberPositionMaxLength: `Member position must be less then ${organizationMemberPositionMinChar} characters`,
  organizationMemberPositionMinLength: `Member position must be greater then ${organizationMemberPositionMaxChar} characters`,
  organizationMemberDetailsRequired: `Organization member details are required`,
  organizationMemberDetailsEmpty: `Organization member details cannot be empty`,
  organizationMemberDetailsUnknownProperty: `Organization member details have unknown property`,
  organizationMemberDetailsMustBeObject: `Organization member details must be an object formate`,
  organizationMemberDetailsNameDuplicate: `Member name must be unique`,
  organizationMemberDetailsEmailDuplicate: `Member email must be unique`,
  organizationMemberDetailsAadhaarNumberDuplicate: `Aadhaar number must be unique`,
  organizationMemberDetailsPhoneNumberDuplicate: `Member phone number must be unique`,
  organizationMembersDetailsRequired: `Organization member's details are required`,
  organizationMembersDetailsEmpty: `Organization member's details can not be empty`,
  organizationMembersDetailsMinLength: `Provide at least one organization member details`,
  organizationMembersDetailsMustBeArray: `Organization member's details must be array formate`,
  organizationMembersDetailsMaxLength: `Can't add more then ${organizationMemberArrayLength} organization member details`,
};

module.exports = organizationMemberValidationMessage;
