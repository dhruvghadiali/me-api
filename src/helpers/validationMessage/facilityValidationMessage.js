const {
  facilityNameMaxChar,
  facilityNameMinChar,
} = require("@MEHelpers/validationConst/validationConst");

const facilityValidationMessage = {
  facilityNameRequired: "Facility name is required",
  facilityNameInvalid: `Invalid facility name. No matching facility name found`,
  facilityNameMaxLength: `Facility name must be less then ${facilityNameMaxChar} characters`,
  facilityNameMinLength: `Facility name must be greater then ${facilityNameMinChar} characters`,
};

module.exports = facilityValidationMessage;
