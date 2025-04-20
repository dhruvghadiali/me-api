const {
  schoolTypeMaxChar,
  schoolTypeMinChar,
} = require("@MEHelpers/validationConst");

const schoolTypeValidationMessage = {
  schoolTypeRequired: "School type is required",
  schoolTypeNotFound: "School type not found in database",
  schoolTypeInvalid: "Invalid school type. No matching school type found",
  schoolTypeMaxLength: `School type must be less then ${schoolTypeMaxChar} characters`,
  schoolTypeMinLength: `School type must be greater then ${schoolTypeMinChar} characters`,
};

module.exports = schoolTypeValidationMessage;
