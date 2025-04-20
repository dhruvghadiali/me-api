const {
  facilityTypeMaxChar,
  facilityTypeMinChar,
} = require("@MEHelpers/validationConst");

const facilityTypeValidationMessage = {
  facilityTypeRequired: "Facility type is required",
  facilityTypeInvalid: "Invalid facility type. No matching facility type found",
  facilityTypeMaxLength: `Facility type must be less then ${facilityTypeMaxChar} characters`,
  facilityTypeMinLength: `Facility type must be greater then ${facilityTypeMinChar} characters`,
};

module.exports = facilityTypeValidationMessage;
