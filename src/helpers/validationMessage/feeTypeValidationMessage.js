const {
  feeTypeMaxChar,
  feeTypeMinChar,
} = require("@MEHelpers/validationConst");

const feeTypeValidationMessage = {
  feeTypeRequired: "Fee type is required",
  feeTypeIdEmpty: "Fee type id can't be empty",
  feeTypeIdRequired: "Fee type id is required",
  feeTypeIdBase: "Fee type id must be string formate",
  feeTypeIdNotFound: "Fee type id not found in database",
  feeTypeIdInvalid: "Invalid Fee type id. No matching fee type id",
  feeTypeEmpty: "Fee type name can't be empty",
  feeTypeBase: "Fee type name must be string formate",
  feeTypeNotFound: "Fee type name not found in database",
  feeTypeReqBodyRequired: "Fee type request body is required",
  feeTypeReqBodyEmpty: "Fee type request body can't be  empty",
  feeTypeInvalid: `Invalid fee type. No matching fee type found`,
  feeTypeReqBodyBase: "Fee type request body has invalid formate",
  feeTypeReqBodyUnknown: "Fee type request body has unknown parameters",
  feeTypeMaxLength: `Fee type must be less then ${feeTypeMaxChar} characters`,
  feeTypeMinLength: `Fee type must be greater then ${feeTypeMinChar} characters`,
};

module.exports = feeTypeValidationMessage;
