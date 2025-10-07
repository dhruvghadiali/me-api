const {} = require("@MEHelpers/validationConst");

const studentAuthValidationMessage = {
  studentSignupReqBodyRequired: "Student signup request body is required",
  studentSignupReqBodyEmpty: "Student signup request body can't be  empty",
  studentSignupReqBodyBase: "Student signup request body has invalid formate",
  studentSignupReqBodyUnknown: `Student signup request body has unknown parameters`,
  studentSigninReqBodyRequired: "Student signin request body is required",
  studentSigninReqBodyEmpty: "Student signin request body can't be  empty",
  studentSigninReqBodyBase: "Student signin request body has invalid formate",
  studentSigninReqBodyUnknown: `Student signin request body has unknown parameters`,
};

module.exports = studentAuthValidationMessage;
