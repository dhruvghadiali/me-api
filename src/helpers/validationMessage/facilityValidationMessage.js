const {
  facilityNameMaxChar,
  facilityNameMinChar,
} = require("@MEHelpers/validationConst");

const facilityValidationMessage = {
  facilityIdRequired: "Facility id is required",
  facilityNameRequired: "Facility name is required",
  facilityNameEmpty: "Facility name can't be empty",
  facilityIdBase: "Facility id must be string formate",
  facilityNameBase: "Facility name must be string formate",
  facilityNameNotFound: "Facility name not found in database",
  facilityReqBodyRequired: "Facility request body is required",
  facilityReqBodyEmpty: "Facility request body can't be  empty",
  facilityReqBodyBase: "Facility request body has invalid formate",
  facilityIdInvalid: `Invalid facility id. No matching facility id`,
  facilityReqBodyUnknown: `Facility request body has unknown parameters`,
  facilityNameInvalid: `Invalid facility name. No matching facility name found`,
  facilityNameMaxLength: `Facility name must be less then ${facilityNameMaxChar} characters`,
  facilityNameMinLength: `Facility name must be greater then ${facilityNameMinChar} characters`,
};

module.exports = facilityValidationMessage;
