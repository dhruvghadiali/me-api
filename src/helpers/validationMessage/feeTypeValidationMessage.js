const {
  feeTypeMaxChar,
  feeTypeMinChar,
} = require("@MEHelpers/validationConst/validationConst");

const feeTypeValidationMessage = {
  feeTypeRequired: "Fee type is required",
  feeTypeMaxLength: `Fee type must be less then ${feeTypeMaxChar} characters`,
  feeTypeMinLength: `Fee type must be greater then ${feeTypeMinChar} characters`,
};

module.exports = feeTypeValidationMessage;
