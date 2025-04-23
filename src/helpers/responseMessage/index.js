const authResponseMessage = require("@MEHelpers/responseMessage/authResponseMessage");
const stateResponseMessage = require("@MEHelpers/responseMessage/stateResponseMessage");
const commonResponseMessage = require("@MEHelpers/responseMessage/commonResponseMessage");
const zipcodeResponseMessage = require("@MEHelpers/responseMessage/zipcodeResponseMessage");
const areaNameResponseMessage = require("@MEHelpers/responseMessage/areaNameResponseMessage");
const districtResponseMessage = require("@MEHelpers/responseMessage/districtResponseMessage");
const academicGradeResponseMessage = require("@MEHelpers/responseMessage/academicGradeResponseMessage");
const educationBoardResponseMessage = require("@MEHelpers/responseMessage/educationBoardResponseMessage");
const admissionDocumentResponseMessage = require("@MEHelpers/responseMessage/admissionDocumentResponseMessage");

const responseMessage = {
  ...authResponseMessage,
  ...stateResponseMessage,
  ...commonResponseMessage,
  ...zipcodeResponseMessage,
  ...districtResponseMessage,
  ...areaNameResponseMessage,
  ...academicGradeResponseMessage,
  ...educationBoardResponseMessage,
  ...admissionDocumentResponseMessage,

  studentSignUpSuccess: "Student Signup process successfully completed",
  studentSignInSuccess: "Students signin process successfully completed",

  schoolTypeGetRequestSuccess: "School type details found successfully",
  schoolTypePostRequestSuccess: "New school type added successfully",
  schoolTypePostRequestFail:
    "Facing issue while adding new school type details",
  schoolTypePutRequestSuccess: "School type details updated successfully",
  schoolTypePutRequestFail: "Facing issue while updating school type details",
  schoolTypeDeleteRequestSuccess: "School type details deleted successfully",
  schoolTypeDeleteRequestFail:
    "Facing issue while deleting school type details",

  feeTypesGetRequestSuccess: "Fee types details found successfully",
  feeTypePostRequestSuccess: "New fee type added successfully",
  feeTypePostRequestFail: "Facing issue while adding new fee type details",
  feeTypePutRequestSuccess: "Fee type details updated successfully",
  feeTypePutRequestFail: "Facing issue while updating fee type details",
  feeTypeDeleteRequestSuccess: "Fee type details deleted successfully",
  feeTypeDeleteRequestFail: "Facing issue while deleting fee type details",
};

module.exports = responseMessage;
