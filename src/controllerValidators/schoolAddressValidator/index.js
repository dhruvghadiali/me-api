const {
  validateSchoolAddressMetaInformationPutReqBody,
} = require("@MEControllerValidators/schoolAddressValidator/updateSchoolAddressMetaInformationValidator");
const {
  validateSchoolAddressPutReqBody,
} = require("@MEControllerValidators/schoolAddressValidator/updateSchoolAddressValidator");
const {
  validateSchoolAddressPostReqBody,
} = require("@MEControllerValidators/schoolAddressValidator/addSchoolAddressValidtoe");

module.exports = {
  validateSchoolAddressPutReqBody,
  validateSchoolAddressPostReqBody,
  validateSchoolAddressMetaInformationPutReqBody,
};
