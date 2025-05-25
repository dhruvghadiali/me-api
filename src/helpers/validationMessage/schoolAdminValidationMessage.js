const { schoolAdminArrayMaxLength } = require("@MEHelpers/validationConst");

const schoolAdminValidationMessage = {
  schoolAdminDetailsRequired: `School admin details are required`,
  schoolAdminDetailsEmpty: `School admin details cannot be empty`,
  schoolAdminDetailsUnknownProperty: `School admin details have unknown property`,
  schoolAdminDetailsMustBeObject: `School admin details must be an object formate`,
  schoolAdminsDetailsRequired: `School admin's details are required`,
  schoolAdminsDetailsEmpty: `School admin's details can not be empty`,
  schoolAdminsDetailsMinLength: `Provide at least one school admin details`,
  schoolAdminsDetailsMustBeArray: `School admin's details must be array formate`,
  schoolAdminsDetailsMaxLength: `Can't add more then ${schoolAdminArrayMaxLength} school admin details`,
};

module.exports = schoolAdminValidationMessage;
