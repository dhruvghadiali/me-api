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
const schoolFeeValidationMessage = require("@MEHelpers/validationMessage/schoolFeeValidationMessage");
const schoolTypeValidationMessage = require("@MEHelpers/validationMessage/schoolTypeValidationMessage");
const schoolAdminValidationMessage = require("@MEHelpers/validationMessage/schoolAdminValidationMessage");
const organizationValidationMessage = require("@MEHelpers/validationMessage/organizationValidationMessage");
const facilityTypeValidationMessage = require("@MEHelpers/validationMessage/facilityTypeValidationMessage");
const schoolFeeLogValidationMessage = require("@MEHelpers/validationMessage/schoolFeeLogValidationMessage");
const schoolAddressValidationMessage = require("@MEHelpers/validationMessage/schoolAddressValidationMessage");
const schoolFeeTypeValidationMessage = require("@MEHelpers/validationMessage/schoolFeeTypeValidationMessage");
const academicClassValidationMessage = require("@MEHelpers/validationMessage/academicClassValidationMessage");
const educationBoardValidationMessage = require("@MEHelpers/validationMessage/educationBoardValidationMessage");
const admissionDocumentValidationMessage = require("@MEHelpers/validationMessage/admissionDocumentValidationMessage");
const organizationMemberValidationMessage = require("@MEHelpers/validationMessage/organizationMemberValidationMessage");
const schoolAcademicClassValidationMessage = require("@MEHelpers/validationMessage/schoolAcademicClassValidationMessage");
const schoolAdmissionDocumentValidationMessage = require("@MEHelpers/validationMessage/schoolAdmissionDocumentValidationMessage");

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
  ...schoolFeeValidationMessage,
  ...schoolTypeValidationMessage,
  ...schoolAdminValidationMessage,
  ...organizationValidationMessage,
  ...facilityTypeValidationMessage,
  ...schoolFeeLogValidationMessage,
  ...schoolAddressValidationMessage,
  ...schoolFeeTypeValidationMessage,
  ...academicClassValidationMessage,
  ...educationBoardValidationMessage,
  ...admissionDocumentValidationMessage,
  ...organizationMemberValidationMessage,
  ...schoolAcademicClassValidationMessage,
  ...schoolAdmissionDocumentValidationMessage,
};

module.exports = validationMessage;
