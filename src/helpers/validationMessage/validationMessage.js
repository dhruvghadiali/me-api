const userValidationMessage = require("@MEHelpers/validationMessage/userValidationMessage");
const authValidationMessage = require("@MEHelpers/validationMessage/authValidationMessage");
const cityValidationMessage = require("@MEHelpers/validationMessage/cityValidationMessage");
const stateValidationMessage = require("@MEHelpers/validationMessage/stateValidationMessage");
const schoolValidationMessage = require("@MEHelpers/validationMessage/schoolValidationMessage");
const commonValidationMessage = require("@MEHelpers/validationMessage/commonValidationMessage");
const zipcodeValidationMessage = require("@MEHelpers/validationMessage/zipcodeValidationMessage");
const feeTypeValidationMessage = require("@MEHelpers/validationMessage/feeTypeValidationMessage");
const facilityValidationMessage = require("@MEHelpers/validationMessage/facilityValidationMessage");
const districtValidationMessage = require("@MEHelpers/validationMessage/districtValidationMessage");
const areaNameValidationMessage = require("@MEHelpers/validationMessage/areaNameValidationMessage");
const schoolTypeValidationMessage = require("@MEHelpers/validationMessage/schoolTypeValidationMessage");
const organizationValidationMessage = require("@MEHelpers/validationMessage/organizationValidationMessage");
const facilityTypeValidationMessage = require("@MEHelpers/validationMessage/facilityTypeValidationMessage");
const academicGradeValidationMessage = require("@MEHelpers/validationMessage/academicGradeValidationMessage");
const educationBoardValidationMessage = require("@MEHelpers/validationMessage/educationBoardValidationMessage");
const organizationMemberValidationMessage = require("@MEHelpers/validationMessage/organizationMemberValidationMessage");

const validationMessage = {
  ...userValidationMessage,
  ...authValidationMessage,
  ...cityValidationMessage,
  ...stateValidationMessage,
  ...schoolValidationMessage,
  ...commonValidationMessage,
  ...zipcodeValidationMessage,
  ...feeTypeValidationMessage,
  ...facilityValidationMessage,
  ...districtValidationMessage,
  ...areaNameValidationMessage,
  ...schoolTypeValidationMessage,
  ...organizationValidationMessage,
  ...facilityTypeValidationMessage,
  ...academicGradeValidationMessage,
  ...educationBoardValidationMessage,
  ...organizationMemberValidationMessage,
};

module.exports = validationMessage;
