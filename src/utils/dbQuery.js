// const School = require("@MEModels/schoolModel");
// const FeeType = require("@MEModels/feeTypeModel");
// const Facility = require("@MEModels/facilityModel");
// const Organization = require("@MEModels/organizationModel");
// const FacilityType = require("@MEModels/facilityTypeModel");
// const AcademicGrade = require("@MEModels/academicGradeModel");
// const AdmissionDocument = require("@MEModels/admissionDocument");

const isActiveUserValidator = async (value) => {
  const User = require("@MEModels/userModel");
  const user = await User.findById(value);
  return !!(user && user.is_active);
};

const isActiveStateExistsValidator = async (value) => {
  const State = require("@MEModels/stateModel");
  const stateExists = await State.findById(value);
  return !!(stateExists && stateExists.is_active);
};

const isActiveDistrictExistsValidator = async (value) => {
  const District = require("@MEModels/districtModel");
  const districtExists = await District.findById(value);
  return !!(districtExists && districtExists.is_active);
};

const isActiveCityExistsValidator = async (value) => {
  const City = require("@MEModels/cityModel");
  const cityExists = await City.findById(value);
  return !!(cityExists && cityExists.is_active);
};

const isActiveAreaNameExistsValidator = async (value) => {
  const AreaName = require("@MEModels/areaNameModel");
  const areaNameExists = await AreaName.findById(value);
  return !!(areaNameExists && areaNameExists.is_active);
};

const isActiveZipcodeExistsValidator = async (value) => {
  const Zipcode = require("@MEModels/zipcodeModel");
  const zipcodeExists = await Zipcode.findById(value);
  return !!(zipcodeExists && zipcodeExists.is_active);
};

// const isActiveFacilityTypeExistsValidator = async (value) => {
//   const facilityTypeExists = await FacilityType.findById(value);
//   return !!(facilityTypeExists && facilityTypeExists.is_active);
// };

// const isActiveOrganizationExistsValidator = async (value) => {
//   const organizationExists = await Organization.findById(value);
//   return !!(organizationExists && organizationExists.is_active);
// };

// const isActiveSchoolExistsValidator = async (value) => {
//   const schoolExists = await School.findById(value);
//   return !!(schoolExists && schoolExists.is_active);
// };

// const isActiveAcademicGradeExistsValidator = async (value) => {
//   const academicGradeExists = await AcademicGrade.findById(value);
//   return !!(academicGradeExists && academicGradeExists.is_active);
// };

// const isActiveAdmissionDocumentExistsValidator = async (value) => {
//   const admissionDocumentExists = await AdmissionDocument.findById(value);
//   return !!(admissionDocumentExists && admissionDocumentExists.is_active);
// };

// const isActiveFacilityExistsValidator = async (value) => {
//   const facilityExists = await Facility.findById(value);
//   return !!(facilityExists && facilityExists.is_active);
// };

// const isActiveFeeTypeExistsValidator = async (value) => {
//   const feeTypeExists = await FeeType.findById(value);
//   return !!(feeTypeExists && feeTypeExists.is_active);
// };

module.exports = {
  isActiveUserValidator,
  isActiveCityExistsValidator,
  isActiveStateExistsValidator,
  // isActiveSchoolExistsValidator,
  isActiveZipcodeExistsValidator,
  // isActiveFeeTypeExistsValidator,
  isActiveDistrictExistsValidator,
  isActiveAreaNameExistsValidator,
  // isActiveFacilityExistsValidator,
  // isActiveFacilityTypeExistsValidator,
  // isActiveOrganizationExistsValidator,
  // isActiveAcademicGradeExistsValidator,
  // isActiveAdmissionDocumentExistsValidator,
};
