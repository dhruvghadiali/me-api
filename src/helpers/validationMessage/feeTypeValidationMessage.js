const {
  feeTypeMaxChar,
  feeTypeMinChar,
} = require("@MEHelpers/validationConst/validationConst");

const feeTypeValidationMessage = {
  feeTypeRequired: "Fee type is required",
  feeTypeInvalid: `Invalid fee type. No matching fee type found`,
  feeTypeMaxLength: `Fee type must be less then ${feeTypeMaxChar} characters`,
  feeTypeMinLength: `Fee type must be greater then ${feeTypeMinChar} characters`,
};

module.exports = feeTypeValidationMessage;
