const {
  stateNameMaxChar,
  stateNameMinChar,
} = require("@MEHelpers/validationConst");

const stateValidationMessage = {
  stateIdRequired: "State id is required",
  stateNameEmpty: "State name can't be empty",
  stateNameRequired: "State name is required",
  stateIdBase: "State id must be string formate",
  stateNameBase: "State name must be string formate",
  stateNameNotFound: "State name not found in database",
  stateReqBodyRequired: "State request body is required",
  stateReqBodyEmpty: "State request body can't be  empty",
  stateIdInvalid: "Invalid state id. No matching state id",
  stateReqBodyBase: "State request body has invalid formate",
  stateNameInvalid: "Invalid state name. No matching state found",
  stateReqBodyUnknown: "State request body has unknown parameters",
  stateNameMaxLength: `State name must be less then ${stateNameMaxChar} characters`,
  stateNameMinLength: `State name must be greater then ${stateNameMinChar} characters`,
};

module.exports = stateValidationMessage;
