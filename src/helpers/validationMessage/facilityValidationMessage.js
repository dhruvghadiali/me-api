const {
  facilityNameMaxChar,
  facilityNameMinChar,
} = require("@MEHelpers/validationConst");

const facilityValidationMessage = {
  facilityIdEmpty: "Facility id can't be empty",
  facilityIdRequired: "Facility id is required",
  facilityIdBase: "Facility id must be string formate",
  facilityIdInvalid: `Invalid facility id. No matching facility id`,
  facilityNameRequired: "Facility name is required",
  facilityNameEmpty: "Facility name can't be empty",
  facilityNameBase: "Facility name must be string formate",
  facilityNameNotFound: "Facility name not found in database",
  facilityReqBodyRequired: "Facility request body is required",
  facilityReqBodyEmpty: "Facility request body can't be  empty",
  facilityReqBodyBase: "Facility request body has invalid formate",
  facilityReqBodyUnknown: `Facility request body has unknown parameters`,
  facilityNameInvalid: `Invalid facility name. No matching facility name found`,
  facilityNameMaxLength: `Facility name must be less then ${facilityNameMaxChar} characters`,
  facilityNameMinLength: `Facility name must be greater then ${facilityNameMinChar} characters`,
};

module.exports = facilityValidationMessage;
