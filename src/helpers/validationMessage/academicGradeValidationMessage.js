const {
  academicGradeMaxChar,
  academicGradeMinChar,
} = require("@MEHelpers/validationConst");

const academicGradeValidationMessage = {
  academicGradeRequired: "Academic grade is required",
  academicGradeInvalid: `Invalid academic grade. No matching academic grade found`,
  academicGradeMaxLength: `Academic grade must be less then ${academicGradeMaxChar} characters`,
  academicGradeMinLength: `Academic grade must be greater then ${academicGradeMinChar} characters`,
};

module.exports = academicGradeValidationMessage;
