// Import validators methods from separate files
const {
  validateAddEmergencyContactProfilePostReqBody,
} = require("@MEControllerValidators/emergencyContactProfileValidator/addEmergencyContactProfileValidator");
const {
  validateUpdateEmergencyContactProfilePutReqBody,
} = require("@MEControllerValidators/emergencyContactProfileValidator/updateEmergencyContactProfileValidator");

module.exports = {
  validateAddEmergencyContactProfilePostReqBody,
  validateUpdateEmergencyContactProfilePutReqBody,
};
