const userValidationConst = require("@MEHelpers/validationConst/userValidationConst");
const authValidationConst = require("@MEHelpers/validationConst/authValidationConst");
const cityValidationConst = require("@MEHelpers/validationConst/cityValidationConst");
const stateValidationConst = require("@MEHelpers/validationConst/stateValidationConst");
const commonValidationConst = require("@MEHelpers/validationConst/commonValidationConst");
const schoolValidationConst = require("@MEHelpers/validationConst/schoolValidationConst");
const zipcodeValidationConst = require("@MEHelpers/validationConst/zipcodeValidationConst");
const admissionDocumentConst = require("@MEHelpers/validationConst/admissionDocumentConst");
const feeTypeValidationConst = require("@MEHelpers/validationConst/feeTypeValidationConst");
const facilityValidationConst = require("@MEHelpers/validationConst/facilityValidationConst");
const areaNameValidationConst = require("@MEHelpers/validationConst/areaNameValidationConst");
const districtValidationConst = require("@MEHelpers/validationConst/districtValidationConst");
const schoolFeeValidationConst = require("@MEHelpers/validationConst/schoolFeeValidationConst");
const schoolTypeValidationConst = require("@MEHelpers/validationConst/schoolTypeValidationConst");
const schoolAdminValidationConst = require("@MEHelpers/validationConst/schoolAdminValidationConst");
const schoolFeeLogValidationConst = require("@MEHelpers/validationConst/schoolFeeLogValidationConst");
const organizationValidationConst = require("@MEHelpers/validationConst/organizationValidationConst");
const facilityTypeValidationConst = require("@MEHelpers/validationConst/facilityTypeValidationConst");
const schoolAddressValidationConst = require("@MEHelpers/validationConst/schoolAddressValidationConst");
const academicClassValidationConst = require("@MEHelpers/validationConst/academicClassValidationConst");
const educationBoardValidationConst = require("@MEHelpers/validationConst/educationBoardValidationConst");
const organizationMemberValidationConst = require("@MEHelpers/validationConst/organizationMemberValidationConst");

const validationConst = {
  ...userValidationConst,
  ...authValidationConst,
  ...cityValidationConst,
  ...stateValidationConst,
  ...commonValidationConst,
  ...schoolValidationConst,
  ...zipcodeValidationConst,
  ...admissionDocumentConst,
  ...feeTypeValidationConst,
  ...facilityValidationConst,
  ...areaNameValidationConst,
  ...districtValidationConst,
  ...schoolFeeValidationConst,
  ...schoolTypeValidationConst,
  ...schoolAdminValidationConst,
  ...schoolFeeLogValidationConst,
  ...organizationValidationConst,
  ...facilityTypeValidationConst,
  ...schoolAddressValidationConst,
  ...academicClassValidationConst,
  ...educationBoardValidationConst,
  ...organizationMemberValidationConst,
};

module.exports = validationConst;
