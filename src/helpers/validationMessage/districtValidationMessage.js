const {
  districtNameMaxChar,
  districtNameMinChar,
} = require("@MEHelpers/validationConst/validationConst");

const districtValidationMessage = {
  districtNameRequired: "District name is required",
  districtNameNotFound: "District name not found in database",
  districtNameInvalid: "Invalid district name. No matching district found",
  districtNameMaxLength: `District name must be less then ${districtNameMaxChar} characters`,
  districtNameMinLength: `District name must be greater then ${districtNameMinChar} characters`,
};

module.exports = districtValidationMessage;
