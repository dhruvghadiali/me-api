const mongoose = require("mongoose");

const User = require("@MEModels/userModel");
const City = require("@MEModels/cityModel");
const State = require("@MEModels/stateModel");
const School = require("@MEModels/schoolModel");
const FeeType = require("@MEModels/feeTypeModel");
const Zipcode = require("@MEModels/zipcodeModel");
const District = require("@MEModels/districtModel");
const AreaName = require("@MEModels/areaNameModel");
const Facility = require("@MEModels/facilityModel");
const SchoolFee = require("@MEModels/schoolFeeModel");
const SchoolType = require("@MEModels/schoolTypeModel");
const FacilityType = require("@MEModels/facilityTypeModel");
const AcademicClass = require("@MEModels/academicClassModel");
const EducationBoard = require("@MEModels/educationBoardModel");
const SchoolFacility = require("@MEModels/schoolFacilityModel");
const AdmissionDocument = require("@MEModels/admissionDocumentModel");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
const SchoolAdmissionDocument = require("@MEModels/schoolAdmissionDocumentModel");
const Address = require("@MEModels/addressModel");
const ParentProfile = require("@MEModels/parentProfileModel");
const EmergencyContact = require("@MEModels/emergencyContactModel");

const {
  usernameFound,
  feeTypeNotFound,
  zipcodeNotFound,
  cityNameNotFound,
  areaNameNotFound,
  stateNameNotFound,
  schoolFeeNotFound,
  schoolTypeNotFound,
  facilityNameNotFound,
  facilityTypeNotFound,
  districtNameNotFound,
  schoolDetailsNotFound,
  academicClassNotFound,
  educationBoardNotFound,
  schoolFacilityNotFound,
  admissionDocumentNotFound,
  schoolAcademicClassNotFound,
  schoolEductionBoardNotFound,
  schoolAdmissionDocumentNotFound,
} = require("@MEHelpers/validationMessage");

const {
  USER_TYPES,
  USER_STATUS,
  ACCOUNT_VERIFICATION_STATUS,
} = require("@ME/helpers/enums");

const checkValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const isActiveStateExists = async (value) => {
  const response = await State.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error(stateNameNotFound);
  }
  return value;
};

const isActiveDistrictExists = async (value) => {
  const response = await District.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error(districtNameNotFound);
  }
  return value;
};

const isActiveCityExists = async (value) => {
  const response = await City.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error(cityNameNotFound);
  }
  return value;
};

const isActiveAreaNameExists = async (value) => {
  const response = await AreaName.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error(areaNameNotFound);
  }
  return value;
};

const isActiveZipcodeExists = async (value) => {
  const response = await Zipcode.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error(zipcodeNotFound);
  }
  return value;
};

const isActiveAcademicClassExists = async (value) => {
  const response = await AcademicClass.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error(academicClassNotFound);
  }
  return value;
};

const isActiveAdmissionDocumentExists = async (value) => {
  const response = await AdmissionDocument.exists({
    _id: value,
    is_active: true,
  });
  if (!response) {
    throw new Error(admissionDocumentNotFound);
  }
  return value;
};

const isActiveEducationBoardExists = async (value) => {
  const response = await EducationBoard.exists({
    _id: value,
    is_active: true,
  });
  if (!response) {
    throw new Error(educationBoardNotFound);
  }
  return value;
};

const isActiveFeeTypeExists = async (value) => {
  const response = await FeeType.exists({
    _id: value,
    is_active: true,
  });
  if (!response) {
    throw new Error(feeTypeNotFound);
  }
  return value;
};

const isActiveFacilityTypeExists = async (value) => {
  const response = await FacilityType.exists({
    _id: value,
    is_active: true,
  });
  if (!response) {
    throw new Error(facilityTypeNotFound);
  }
  return value;
};

const isActiveFacilityExists = async (value) => {
  const response = await Facility.exists({
    _id: value,
    is_active: true,
  });
  if (!response) {
    throw new Error(facilityNameNotFound);
  }
  return value;
};

const isActiveSchoolTypeExists = async (value) => {
  const response = await SchoolType.exists({
    _id: value,
    is_active: true,
  });
  if (!response) {
    throw new Error(schoolTypeNotFound);
  }
  return value;
};

const isActiveSchoolExists = async (value) => {
  const response = await School.exists({
    _id: value,
    is_active: true,
  });

  if (!response) {
    throw new Error(schoolDetailsNotFound);
  }
  return value;
};

const isSchoolHasActiveEducationBoardExists = async (value, helpers) => {
  const response = await EducationBoard.exists({
    _id: value,
    is_active: true,
  });
  if (!response) {
    throw new Error(educationBoardNotFound);
  } else {
    const school = await School.findOne({
      _id: helpers?.state?.ancestors?.[0].school,
      education_boards: value,
      is_active: true,
    });
    if (!school) {
      throw new Error(schoolEductionBoardNotFound);
    }
  }
  return value;
};

const isActiveSchoolAcademicClassExists = async (value, helpers) => {
  const response = await SchoolAcademicClass.exists({
    _id: value,
    is_active: true,
  });

  if (!response) {
    throw new Error(schoolAcademicClassNotFound);
  }
  return value;
};

const isActiveSchoolFeeExists = async (value, helpers) => {
  const response = await SchoolFee.exists({
    _id: value,
    is_active: true,
  });

  if (!response) {
    throw new Error(schoolFeeNotFound);
  }
  return value;
};

const isActiveSchoolAdmissionDocumentExists = async (value) => {
  const response = await SchoolAdmissionDocument.exists({
    _id: value,
    is_active: true,
  });
  if (!response) {
    throw new Error(schoolAdmissionDocumentNotFound);
  }
  return value;
};

const isActiveSchoolFacilityExists = async (value) => {
  const response = await SchoolFacility.exists({
    _id: value,
    is_active: true,
  });
  if (!response) {
    throw new Error(schoolFacilityNotFound);
  }
  return value;
};

const isUserNameExists = async (value) => {
  const response = await User.exists({
    username: value,
  });
  if (response) {
    throw new Error(usernameFound);
  }
  return value;
};

const checkStudentForSignupSendOTP = async (value) => {
  const response = await User.exists({
    id: value,
    is_active: USER_STATUS.INACTIVE,
    is_account_verified: ACCOUNT_VERIFICATION_STATUS.UNVERIFIED,
    user_type: USER_TYPES.STUDENT,
  });
  if (response) {
    throw new Error(usernameFound);
  }
  return value;
};

const checkStudentForForgottenPasswordSendOTP = async (value) => {
  const response = await User.exists({
    id: value,
    is_active: USER_STATUS.ACTIVE,
    is_account_verified: ACCOUNT_VERIFICATION_STATUS.VERIFIED,
    user_type: USER_TYPES.STUDENT,
  });
  if (response) {
    throw new Error(usernameFound);
  }
  return value;
};

const isActiveUserExists = async (value) => {
  const response = await User.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error("User not found or inactive");
  }
  return value;
};

const isActiveAddressExists = async (value) => {
  const response = await Address.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error("Address not found or inactive");
  }
  return value;
};

const isActiveParentProfileExists = async (value) => {
  const response = await ParentProfile.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error("Parent profile not found or inactive");
  }
  return value;
};

const isActiveEmergencyContactExists = async (value) => {
  const response = await EmergencyContact.exists({
    _id: value,
    is_active: true,
  });
  if (!response) {
    throw new Error("Emergency contact not found or inactive");
  }
  return value;
};

module.exports = {
  isUserNameExists,
  isActiveCityExists,
  checkValidObjectId,
  isActiveStateExists,
  isActiveSchoolExists,
  isActiveFeeTypeExists,
  isActiveZipcodeExists,
  isActiveDistrictExists,
  isActiveAreaNameExists,
  isActiveFacilityExists,
  isActiveSchoolFeeExists,
  isActiveSchoolTypeExists,
  isActiveFacilityTypeExists,
  isActiveAcademicClassExists,
  isActiveEducationBoardExists,
  isActiveSchoolFacilityExists,
  checkStudentForSignupSendOTP,
  isActiveAdmissionDocumentExists,
  isActiveSchoolAcademicClassExists,
  isSchoolHasActiveEducationBoardExists,
  isActiveSchoolAdmissionDocumentExists,
  checkStudentForForgottenPasswordSendOTP,
  isActiveUserExists,
  isActiveAddressExists,
  isActiveParentProfileExists,
  isActiveEmergencyContactExists,
};
