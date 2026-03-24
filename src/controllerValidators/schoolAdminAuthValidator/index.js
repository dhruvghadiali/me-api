// Import validators methods from separate files
const {
  validateUpdateSchoolAdminPasswordPutReqBody,
} = require("@MEControllerValidators/schoolAdminAuthValidator/updateSchoolAdminPasswordValidator");
const {
  validateUpdateSchoolAdminUsernamePutReqBody,
} = require("@MEControllerValidators/schoolAdminAuthValidator/updateSchoolAdminUsernameValidator");

module.exports = {
  validateUpdateSchoolAdminPasswordPutReqBody,
  validateUpdateSchoolAdminUsernamePutReqBody,
};
