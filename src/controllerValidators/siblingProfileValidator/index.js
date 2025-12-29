// Import validators methods from separate files
const {
  validateAddSiblingProfilePostReqBody,
} = require("@MEControllerValidators/siblingProfileValidator/addSiblingProfileValidator");
const {
  validateUpdateSiblingProfilePutReqBody,
} = require("@MEControllerValidators/siblingProfileValidator/updateSiblingProfileValidator");

module.exports = {
  validateAddSiblingProfilePostReqBody,
  validateUpdateSiblingProfilePutReqBody,
};
