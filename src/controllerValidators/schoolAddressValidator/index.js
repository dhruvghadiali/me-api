const {
  validateSchoolAddressMetaInformationPutReqBody,
} = require("@MEControllerValidators/schoolAddressValidator/updateSchoolAddressMetaInformationValidator");
const {
  validateSchoolAddressPutReqBody,
} = require("@MEControllerValidators/schoolAddressValidator/updateSchoolAddressValidator");

module.exports = {
  validateSchoolAddressPutReqBody,
  validateSchoolAddressMetaInformationPutReqBody,
};
