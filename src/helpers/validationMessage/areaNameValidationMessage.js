const {
  areaNameMaxChar,
  areaNameMinChar,
} = require("@MEHelpers/validationConst");

const areaNameValidationMessage = {
  areaNameRequired: "Area name is required",
  areaNameIdRequired: "Area name id is required",
  areaNameEmpty: "Area name name can't be empty",
  areaNameBase: "Area name must be string formate",
  areaNameNotFound: "Area name not found in database",
  areaNameIdBase: "Area name id must be string formate",
  areaNameReqBodyRequired: "Area name request body is required",
  areaNameReqBodyEmpty: "Area name request body can't be  empty",
  areaNameInvalid: "Invalid area name. No matching area name found",
  areaNameReqBodyBase: "Area name request body has invalid formate",
  areaNameIdInvalid: "Invalid area name id. No matching area name id",
  areaNameReqBodyUnknown: "Area name request body has unknown parameters",
  areaNameMaxLength: `Area name must be less then ${areaNameMaxChar} characters`,
  areaNameMinLength: `Area name must be greater then ${areaNameMinChar} characters`,
};

module.exports = areaNameValidationMessage;
