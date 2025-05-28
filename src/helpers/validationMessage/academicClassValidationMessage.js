const {
  academicClassMaxChar,
  academicClassMinChar,
} = require("@MEHelpers/validationConst");

const academicClassValidationMessage = {
  academicClassRequired: "Academic class is required",
  academicClassEmpty: "Academic class can't be empty",
  academicClassIdRequired: "Academic class id is required",
  academicClassBase: "Academic class must be string formate",
  academicClassNotFound: "Academic class not found in database",
  academicClassIdBase: "Academic class id must be string formate",
  academicClassReqBodyRequired: "Academic class request body is required",
  academicClassReqBodyEmpty: "Academic class request body can't be  empty",
  academicClassReqBodyBase: "Academic class request body has invalid formate",
  academicClassInvalid: `Invalid academic class. No matching academic class found`,
  academicClassReqBodyUnknown: `Academic class request body has unknown parameters`,
  academicClassIdInvalid: `Invalid academic class id. No matching academic class id`,
  academicClassMaxLength: `Academic class must be less then ${academicClassMaxChar} characters`,
  academicClassMinLength: `Academic class must be greater then ${academicClassMinChar} characters`,
};

module.exports = academicClassValidationMessage;
