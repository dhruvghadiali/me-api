const authResponseMessage = require("@MEHelpers/responseMessage/authResponseMessage");
const stateResponseMessage = require("@MEHelpers/responseMessage/stateResponseMessage");
const commonResponseMessage = require("@MEHelpers/responseMessage/commonResponseMessage");
const districtResponseMessage = require("@MEHelpers/responseMessage/districtResponseMessage");
const academicGradeResponseMessage = require("@MEHelpers/responseMessage/academicGradeResponseMessage");
const admissionDocumentResponseMessage = require("@MEHelpers/responseMessage/admissionDocumentResponseMessage");

const responseMessage = {
  ...authResponseMessage,
  ...stateResponseMessage,
  ...commonResponseMessage,
  ...districtResponseMessage,
  ...academicGradeResponseMessage,
  ...admissionDocumentResponseMessage,

  studentSignUpSuccess: "Student Signup process successfully completed",
  studentSignInSuccess: "Students signin process successfully completed",

  areaNamesGetRequestSuccess: "Area names details found successfully",
  areaNamePostRequestSuccess: "New area name added successfully",
  areaNamePostRequestFail: "Facing issue while adding new area name details",
  areaNamePutRequestSuccess: "Area name details updated successfully",
  areaNamePutRequestFail: "Facing issue while updating area name details",
  areaNameDeleteRequestSuccess: "Area name details deleted successfully",
  areaNameDeleteRequestFail: "Facing issue while deleting area name details",
  zipcodesGetRequestSuccess: "Zipcodes details found successfully",
  zipcodePostRequestSuccess: "New zipcode added successfully",
  zipcodePostRequestFail: "Facing issue while adding new zipcode details",
  zipcodePutRequestSuccess: "Zipcode details updated successfully",
  zipcodePutRequestFail: "Facing issue while updating zipcode details",
  zipcodeDeleteRequestSuccess: "Zipcode details deleted successfully",
  zipcodeDeleteRequestFail: "Facing issue while deleting zipcode details",
  schoolTypeGetRequestSuccess: "School type details found successfully",
  schoolTypePostRequestSuccess: "New school type added successfully",
  schoolTypePostRequestFail:
    "Facing issue while adding new school type details",
  schoolTypePutRequestSuccess: "School type details updated successfully",
  schoolTypePutRequestFail: "Facing issue while updating school type details",
  schoolTypeDeleteRequestSuccess: "School type details deleted successfully",
  schoolTypeDeleteRequestFail:
    "Facing issue while deleting school type details",
  educationBoardGetRequestSuccess: "Education board details found successfully",
  educationBoardPostRequestSuccess: "New education board added successfully",
  educationBoardPostRequestFail:
    "Facing issue while adding new education board details",
  educationBoardPutRequestSuccess:
    "Education board details updated successfully",
  educationBoardPutRequestFail:
    "Facing issue while updating education board details",
  educationBoardDeleteRequestSuccess:
    "Education board details deleted successfully",
  educationBoardDeleteRequestFail:
    "Facing issue while deleting education board details",

  feeTypesGetRequestSuccess: "Fee types details found successfully",
  feeTypePostRequestSuccess: "New fee type added successfully",
  feeTypePostRequestFail: "Facing issue while adding new fee type details",
  feeTypePutRequestSuccess: "Fee type details updated successfully",
  feeTypePutRequestFail: "Facing issue while updating fee type details",
  feeTypeDeleteRequestSuccess: "Fee type details deleted successfully",
  feeTypeDeleteRequestFail: "Facing issue while deleting fee type details",
};

module.exports = responseMessage;
