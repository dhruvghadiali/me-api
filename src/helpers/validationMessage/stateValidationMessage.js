const {
  stateNameMaxChar,
  stateNameMinChar,
} = require("@MEHelpers/validationConst/validationConst");

const stateValidationMessage = {
  stateNameRequired: "State name is required",
  stateNameNotFound: "State name not found in database",
  stateNameInvalid: "Invalid state name. No matching state found",
  stateNameMaxLength: `State name must be less then ${stateNameMaxChar} characters`,
  stateNameMinLength: `State name must be greater then ${stateNameMinChar} characters`,
};

module.exports = stateValidationMessage;
