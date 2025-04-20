const {
  areaNameMaxChar,
  areaNameMinChar,
} = require("@MEHelpers/validationConst");

const areaNameValidationMessage = {
  areaNameRequired: "Area name is required",
  areaNameNotFound: "Area name not found in database",
  areaNameInvalid: "Invalid area name. No matching area name found",
  areaNameMaxLength: `Area name must be less then ${areaNameMaxChar} characters`,
  areaNameMinLength: `Area name must be greater then ${areaNameMinChar} characters`,
};

module.exports = areaNameValidationMessage;
