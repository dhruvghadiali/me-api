const {} = require("@MEHelpers/validationConst");

const studentAuthValidationMessage = {
  studentSignupReqBodyRequired: "Student signup request body is required",
  studentSignupReqBodyEmpty: "Student signup request body can't be  empty",
  studentSignupReqBodyBase: "Student signup request body has invalid formate",
  studentSignupReqBodyUnknown: `Student signup request body has unknown parameters`,
};

module.exports = studentAuthValidationMessage;
