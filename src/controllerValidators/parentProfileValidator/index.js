// Import validators methods from separate files
const {
  validateAddParentProfilePostReqBody,
} = require("@MEControllerValidators/parentProfileValidator/addParentProfileValidator");
const {
  validateUpdateParentProfilePutReqBody,
} = require("@MEControllerValidators/parentProfileValidator/updateParentProfileValidator");

module.exports = {
  validateAddParentProfilePostReqBody,
  validateUpdateParentProfilePutReqBody,
};
