const {
  facilityTypeMaxChar,
  facilityTypeMinChar,
} = require("@MEHelpers/validationConst");

const facilityTypeValidationMessage = {
  facilityTypeRequired: "Facility type is required",
  facilityTypeEmpty: "Facility type can't be empty",
  facilityTypeIdRequired: "Facility type id is required",
  facilityTypeBase: "Facility type must be string formate",
  facilityTypeNotFound: "Facility type not found in database",
  facilityTypeIdBase: "Facility type id must be string formate",
  facilityTypeReqBodyRequired: "Facility type request body is required",
  facilityTypeReqBodyEmpty: "Facility type request body can't be  empty",
  facilityTypeReqBodyBase: "Facility type request body has invalid formate",
  facilityTypeInvalid: "Invalid facility type. No matching facility type found",
  facilityTypeIdInvalid: `Invalid facility type id. No matching facility type id`,
  facilityTypeReqBodyUnknown: `Facility type request body has unknown parameters`,
  facilityTypeMaxLength: `Facility type must be less then ${facilityTypeMaxChar} characters`,
  facilityTypeMinLength: `Facility type must be greater then ${facilityTypeMinChar} characters`,
};

module.exports = facilityTypeValidationMessage;
