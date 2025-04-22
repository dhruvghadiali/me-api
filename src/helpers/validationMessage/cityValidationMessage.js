const {
  cityNameMaxChar,
  cityNameMinChar,
} = require("@MEHelpers/validationConst");

const cityValidationMessage = {
  cityIdRequired: "City id is required",
  cityNameRequired: "City name is required",
  cityNameEmpty: "City name can't be empty",
  cityIdBase: "City id must be string formate",
  cityNameBase: "City name must be string formate",
  cityNameNotFound: "City name not found in database",
  cityReqBodyRequired: "City request body is required",
  cityIdInvalid: "Invalid city id. No matching city id",
  cityReqBodyEmpty: "City request body can't be  empty",
  cityNameInvalid: "Invalid city. No matching city found",
  cityReqBodyBase: "City request body has invalid formate",
  cityReqBodyUnknown: "City request body has unknown parameters",
  cityNameMaxLength: `City name must be less then ${cityNameMaxChar} characters`,
  cityNameMinLength: `City name must be greater then ${cityNameMinChar} characters`,
};

module.exports = cityValidationMessage;
