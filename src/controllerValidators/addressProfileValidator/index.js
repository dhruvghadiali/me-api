// Import validators methods from separate files
const {
  validateAddAddressProfilePostReqBody,
} = require("@MEControllerValidators/addressProfileValidator/addAddressProfileValidator");
const {
  validateUpdateAddressProfilePutReqBody,
} = require("@MEControllerValidators/addressProfileValidator/updateAddressProfileValidator");

module.exports = {
  validateAddAddressProfilePostReqBody,
  validateUpdateAddressProfilePutReqBody,
};
