const {
  districtNameMaxChar,
  districtNameMinChar,
} = require("@MEHelpers/validationConst");

const districtValidationMessage = {
  districtIdRequired: "District id is required",
  districtNameEmpty: "District name can't be empty",
  districtNameRequired: "District name is required",
  districtIdBase: "District id must be string formate",
  districtNameBase: "District name must be string formate",
  districtNameNotFound: "District name not found in database",
  districtReqBodyRequired: "District request body is required",
  districtReqBodyEmpty: "District request body can't be  empty",
  districtReqBodyBase: "District request body has invalid formate",
  districtIdInvalid: "Invalid district id. No matching district id",
  districtReqBodyUnknown: "District request body has unknown parameters",
  districtNameInvalid: "Invalid district name. No matching district found",
  districtNameMaxLength: `District name must be less then ${districtNameMaxChar} characters`,
  districtNameMinLength: `District name must be greater then ${districtNameMinChar} characters`,
};

module.exports = districtValidationMessage;
