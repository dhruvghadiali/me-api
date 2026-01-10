// Import validators methods from separate files
const {
  validateStudentUpdatePasswordPutReqBody,
} = require("@MEControllerValidators/studentAuthValidator/studentUpdatePasswordValidator");
const {
  validateStudentUpdateUsernamePutReqBody,
} = require("@MEControllerValidators/studentAuthValidator/studentUpdateUsernameValidator");

module.exports = {
  validateStudentUpdatePasswordPutReqBody,
  validateStudentUpdateUsernamePutReqBody,
};
