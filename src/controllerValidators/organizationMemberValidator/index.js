// Import validators methods from separate files
const {
  validateAddOrganizationMemberPostReqBody,
} = require("@MEControllerValidators/organizationMemberValidator/addOrganizationMemberValidator");
const {
  validateUpdateOrganizationMemberPutReqBody,
} = require("@MEControllerValidators/organizationMemberValidator/updateOrganizationMemberValidator");

module.exports = {
  validateAddOrganizationMemberPostReqBody,
  validateUpdateOrganizationMemberPutReqBody,
};
