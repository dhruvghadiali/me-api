const authResponseMessage = require("@MEHelpers/responseMessage/authResponseMessage");
const cityResponseMessage = require("@MEHelpers/responseMessage/cityResponseMessage");
const stateResponseMessage = require("@MEHelpers/responseMessage/stateResponseMessage");
const schoolResponseMessage = require("@MEHelpers/responseMessage/schoolResponseMessage");
const commonResponseMessage = require("@MEHelpers/responseMessage/commonResponseMessage");
const feeTypeResponseMessage = require("@MEHelpers/responseMessage/feeTypeResponseMessage");
const zipcodeResponseMessage = require("@MEHelpers/responseMessage/zipcodeResponseMessage");
const facilityResponseMessage = require("@MEHelpers/responseMessage/facilityResponseMessage");
const areaNameResponseMessage = require("@MEHelpers/responseMessage/areaNameResponseMessage");
const districtResponseMessage = require("@MEHelpers/responseMessage/districtResponseMessage");
const schoolFeeResponseMessage = require("@MEHelpers/responseMessage/schoolFeeResponseMessage");
const schoolTypeResponseMessage = require("@MEHelpers/responseMessage/schoolTypeResponseMessage");
const organizationResponseMessage = require("@MEHelpers/responseMessage/organizationResponseMessage");
const facilityTypeResponseMessage = require("@MEHelpers/responseMessage/facilityTypeResponseMessage");
const schoolAddressResponseMessage = require("@MEHelpers/responseMessage/schoolAddressResponseMessage");
const academicClassResponseMessage = require("@MEHelpers/responseMessage/academicClassResponseMessage");
const educationBoardResponseMessage = require("@MEHelpers/responseMessage/educationBoardResponseMessage");
const schoolFacilityResponseMessage = require("@MEHelpers/responseMessage/schoolFacilityResponseMessage");
const addressProfileResponseMessage = require("@MEHelpers/responseMessage/addressProfileResponseMessage");
const admissionDocumentResponseMessage = require("@MEHelpers/responseMessage/admissionDocumentResponseMessage");
const organizationMemberResponseMessage = require("@MEHelpers/responseMessage/organizationMemberResponseMessage");
const schoolAcademicClassResponseMessage = require("@MEHelpers/responseMessage/schoolAcademicClassResponseMessage");
const admissionApplicationResponseMessage = require("@MEHelpers/responseMessage/admissionApplicationResponseMessage");
const schoolAdmissionDocumentResponseMessage = require("@MEHelpers/responseMessage/schoolAdmissionDocumentResponseMessage");
const emergencyContactProfileResponseMessage = require("@MEHelpers/responseMessage/emergencyContactProfileResponseMessage");

const responseMessage = {
  ...authResponseMessage,
  ...cityResponseMessage,
  ...stateResponseMessage,
  ...schoolResponseMessage,
  ...commonResponseMessage,
  ...feeTypeResponseMessage,
  ...zipcodeResponseMessage,
  ...districtResponseMessage,
  ...facilityResponseMessage,
  ...areaNameResponseMessage,
  ...schoolFeeResponseMessage,
  ...schoolTypeResponseMessage,
  ...organizationResponseMessage,
  ...facilityTypeResponseMessage,
  ...schoolAddressResponseMessage,
  ...academicClassResponseMessage,
  ...educationBoardResponseMessage,
  ...addressProfileResponseMessage,
  ...schoolFacilityResponseMessage,
  ...admissionDocumentResponseMessage,
  ...organizationMemberResponseMessage,
  ...schoolAcademicClassResponseMessage,
  ...admissionApplicationResponseMessage,
  ...schoolAdmissionDocumentResponseMessage,
  ...emergencyContactProfileResponseMessage,
  studentSignUpSuccess: "Student Signup process successfully completed",
  studentSignInSuccess: "Students signin process successfully completed",
};

module.exports = responseMessage;
