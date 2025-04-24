const {
  schoolTypeMaxChar,
  schoolTypeMinChar,
} = require("@MEHelpers/validationConst");

const schoolTypeValidationMessage = {
  schoolTypeRequired: "School type is required",
  schoolTypeEmpty: "School type can't be empty",
  schoolTypeIdRequired: "School type id is required",
  schoolTypeBase: "School type must be string formate",
  schoolTypeNotFound: "School type not found in database",
  schoolTypeIdBase: "School type id must be string formate",
  schoolTypeReqBodyRequired: "School type request body is required",
  schoolTypeReqBodyEmpty: "School type request body can't be  empty",
  schoolTypeReqBodyBase: "School type request body has invalid formate",
  schoolTypeInvalid: "Invalid school type. No matching school type found",
  schoolTypeIdInvalid: "Invalid school type id. No matching school type id",
  schoolTypeReqBodyUnknown: "School type request body has unknown parameters",
  schoolTypeMaxLength: `School type must be less then ${schoolTypeMaxChar} characters`,
  schoolTypeMinLength: `School type must be greater then ${schoolTypeMinChar} characters`,
};

module.exports = schoolTypeValidationMessage;
