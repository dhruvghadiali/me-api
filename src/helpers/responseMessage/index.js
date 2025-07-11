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
const admissionDocumentResponseMessage = require("@MEHelpers/responseMessage/admissionDocumentResponseMessage");
const organizationMemberResponseMessage = require("@MEHelpers/responseMessage/organizationMemberResponseMessage");
const schoolAcademicClassResponseMessage = require("@MEHelpers/responseMessage/schoolAcademicClassResponseMessage");
const schoolAdmissionDocumentResponseMessage = require("@MEHelpers/responseMessage/schoolAdmissionDocumentResponseMessage");

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
  ...schoolFacilityResponseMessage,
  ...admissionDocumentResponseMessage,
  ...organizationMemberResponseMessage,
  ...schoolAcademicClassResponseMessage,
  ...schoolAdmissionDocumentResponseMessage,
  studentSignUpSuccess: "Student Signup process successfully completed",
  studentSignInSuccess: "Students signin process successfully completed",
};

module.exports = responseMessage;
