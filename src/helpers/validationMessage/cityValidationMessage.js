const {
  cityNameMaxChar,
  cityNameMinChar,
} = require("@MEHelpers/validationConst");

const cityValidationMessage = {
  cityNameRequired: "City name is required",
  cityNameNotFound: "City name not found in database",
  cityNameInvalid: "Invalid city. No matching city found",
  cityNameMaxLength: `City name must be less then ${cityNameMaxChar} characters`,
  cityNameMinLength: `City name must be greater then ${cityNameMinChar} characters`,
};

module.exports = cityValidationMessage;
