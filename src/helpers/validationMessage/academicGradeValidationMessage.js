const {
  academicGradeMaxChar,
  academicGradeMinChar,
} = require("@MEHelpers/validationConst");

const academicGradeValidationMessage = {
  academicGradeRequired: "Academic grade is required",
  academicGradeEmpty: "Academic grade can't be empty",
  academicGradeIdRequired: "Academic grade id is required",
  academicGradeBase: "Academic grade must be string formate",
  academicGradeNotFound: "Academic grade not found in database",
  academicGradeIdBase: "Academic grade id must be string formate",
  academicGradeReqBodyRequired: "Academic grade request body is required",
  academicGradeReqBodyEmpty: "Academic grade request body can't be  empty",
  academicGradeReqBodyBase: "Academic grade request body has invalid formate",
  academicGradeInvalid: `Invalid academic grade. No matching academic grade found`,
  academicGradeReqBodyUnknown: `Academic grade request body has unknown parameters`,
  academicGradeIdInvalid: `Invalid academic grade id. No matching academic grade id`,
  academicGradeMaxLength: `Academic grade must be less then ${academicGradeMaxChar} characters`,
  academicGradeMinLength: `Academic grade must be greater then ${academicGradeMinChar} characters`,
};

module.exports = academicGradeValidationMessage;
