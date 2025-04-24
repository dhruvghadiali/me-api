const {
  feeTypeMaxChar,
  feeTypeMinChar,
} = require("@MEHelpers/validationConst");

const feeTypeValidationMessage = {
  feeTypeRequired: "Fee type is required",
  feeTypeIdRequired: "Fee type id is required",
  feeTypeEmpty: "Fee type name can't be empty",
  feeTypeIdBase: "Fee type id must be string formate",
  feeTypeBase: "Fee type name must be string formate",
  feeTypeNotFound: "Fee type name not found in database",
  feeTypeReqBodyRequired: "Fee type request body is required",
  feeTypeReqBodyEmpty: "Fee type request body can't be  empty",
  feeTypeInvalid: `Invalid fee type. No matching fee type found`,
  feeTypeReqBodyBase: "Fee type request body has invalid formate",
  feeTypeIdInvalid: "Invalid Fee type id. No matching fee type id",
  feeTypeReqBodyUnknown: "Fee type request body has unknown parameters",
  feeTypeMaxLength: `Fee type must be less then ${feeTypeMaxChar} characters`,
  feeTypeMinLength: `Fee type must be greater then ${feeTypeMinChar} characters`,
};

module.exports = feeTypeValidationMessage;
