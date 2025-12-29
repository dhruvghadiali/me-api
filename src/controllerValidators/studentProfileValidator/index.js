// Import validators methods from separate files
const {
  validateAddStudentProfilePostReqBody,
} = require("@MEControllerValidators/studentProfileValidator/addStudentProfileValidator");
const {
  validateUpdateStudentProfilePutReqBody,
} = require("@MEControllerValidators/studentProfileValidator/updateStudentProfileValidator");

module.exports = {
  validateAddStudentProfilePostReqBody,
  validateUpdateStudentProfilePutReqBody,
};
