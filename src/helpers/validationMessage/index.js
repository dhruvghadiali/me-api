const userValidationMessage = require("@MEHelpers/validationMessage/userValidationMessage");
const authValidationMessage = require("@MEHelpers/validationMessage/authValidationMessage");
const cityValidationMessage = require("@MEHelpers/validationMessage/cityValidationMessage");
const stateValidationMessage = require("@MEHelpers/validationMessage/stateValidationMessage");
const schoolValidationMessage = require("@MEHelpers/validationMessage/schoolValidationMessage");
const commonValidationMessage = require("@MEHelpers/validationMessage/commonValidationMessage");
const zipcodeValidationMessage = require("@MEHelpers/validationMessage/zipcodeValidationMessage");
const feeTypeValidationMessage = require("@MEHelpers/validationMessage/feeTypeValidationMessage");
const paymentValidationMessage = require("@MEHelpers/validationMessage/paymentValidationMessage");
const facilityValidationMessage = require("@MEHelpers/validationMessage/facilityValidationMessage");
const districtValidationMessage = require("@MEHelpers/validationMessage/districtValidationMessage");
const areaNameValidationMessage = require("@MEHelpers/validationMessage/areaNameValidationMessage");
const schoolTypeValidationMessage = require("@MEHelpers/validationMessage/schoolTypeValidationMessage");
const schoolAdminValidationMessage = require("@MEHelpers/validationMessage/schoolAdminValidationMessage");
const organizationValidationMessage = require("@MEHelpers/validationMessage/organizationValidationMessage");
const facilityTypeValidationMessage = require("@MEHelpers/validationMessage/facilityTypeValidationMessage");
const schoolAddressValidationMessage = require("@MEHelpers/validationMessage/schoolAddressValidationMessage");
const schoolFeeTypeValidationMessage = require("@MEHelpers/validationMessage/schoolFeeTypeValidationMessage");
const academicClassValidationMessage = require("@MEHelpers/validationMessage/academicClassValidationMessage");
const educationBoardValidationMessage = require("@MEHelpers/validationMessage/educationBoardValidationMessage");
const admissionDocumentValidationMessage = require("@MEHelpers/validationMessage/admissionDocumentValidationMessage");
const organizationMemberValidationMessage = require("@MEHelpers/validationMessage/organizationMemberValidationMessage");
const schoolAcademicClassValidationMessage = require("@MEHelpers/validationMessage/schoolAcademicClassValidationMessage");

const validationMessage = {
  ...userValidationMessage,
  ...authValidationMessage,
  ...cityValidationMessage,
  ...stateValidationMessage,
  ...schoolValidationMessage,
  ...commonValidationMessage,
  ...zipcodeValidationMessage,
  ...feeTypeValidationMessage,
  ...paymentValidationMessage,
  ...facilityValidationMessage,
  ...districtValidationMessage,
  ...areaNameValidationMessage,
  ...schoolTypeValidationMessage,
  ...schoolAdminValidationMessage,
  ...organizationValidationMessage,
  ...facilityTypeValidationMessage,
  ...schoolAddressValidationMessage,
  ...schoolFeeTypeValidationMessage,
  ...academicClassValidationMessage,
  ...educationBoardValidationMessage,
  ...admissionDocumentValidationMessage,
  ...organizationMemberValidationMessage,
  ...schoolAcademicClassValidationMessage,
};

module.exports = validationMessage;
