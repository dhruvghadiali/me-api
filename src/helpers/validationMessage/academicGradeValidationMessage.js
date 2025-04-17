const {
  academicGradeMaxChar,
  academicGradeMinChar,
} = require("@MEHelpers/validationConst/validationConst");

const academicGradeValidationMessage = {
  academicGradeRequired: "Academic grade is required",
  academicGradeMaxLength: `Academic grade must be less then ${academicGradeMaxChar} characters`,
  academicGradeMinLength: `Academic grade must be greater then ${academicGradeMinChar} characters`,
};

module.exports = academicGradeValidationMessage;
