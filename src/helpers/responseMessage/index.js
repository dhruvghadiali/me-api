const authResponseMessage = require("@MEHelpers/responseMessage/authResponseMessage");
const stateResponseMessage = require("@MEHelpers/responseMessage/stateResponseMessage");
const commonResponseMessage = require("@MEHelpers/responseMessage/commonResponseMessage");
const feeTypeResponseMessage = require("@MEHelpers/responseMessage/feeTypeResponseMessage");
const zipcodeResponseMessage = require("@MEHelpers/responseMessage/zipcodeResponseMessage");
const areaNameResponseMessage = require("@MEHelpers/responseMessage/areaNameResponseMessage");
const districtResponseMessage = require("@MEHelpers/responseMessage/districtResponseMessage");
const schoolTypeResponseMessage = require("@MEHelpers/responseMessage/schoolTypeResponseMessage");
const facilityTypeResponseMessage = require("@MEHelpers/responseMessage/facilityTypeResponseMessage");
const academicGradeResponseMessage = require("@MEHelpers/responseMessage/academicGradeResponseMessage");
const educationBoardResponseMessage = require("@MEHelpers/responseMessage/educationBoardResponseMessage");
const admissionDocumentResponseMessage = require("@MEHelpers/responseMessage/admissionDocumentResponseMessage");

const responseMessage = {
  ...authResponseMessage,
  ...stateResponseMessage,
  ...commonResponseMessage,
  ...feeTypeResponseMessage,
  ...zipcodeResponseMessage,
  ...districtResponseMessage,
  ...areaNameResponseMessage,
  ...schoolTypeResponseMessage,
  ...facilityTypeResponseMessage,
  ...academicGradeResponseMessage,
  ...educationBoardResponseMessage,
  ...admissionDocumentResponseMessage,
  studentSignUpSuccess: "Student Signup process successfully completed",
  studentSignInSuccess: "Students signin process successfully completed",
};

module.exports = responseMessage;
