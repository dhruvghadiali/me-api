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

const isActiveFacilityTypeExistsValidator = async (value) => {
  const FacilityType = require("@MEModels/facilityTypeModel");
  const facilityTypeExists = await FacilityType.findById(value);
  return !!(facilityTypeExists && facilityTypeExists.is_active);
};

const isActiveOrganizationExistsValidator = async (value) => {
  const Organization = require("@MEModels/organizationModel");
  const organizationExists = await Organization.findById(value);
  return !!(organizationExists && organizationExists.is_active);
};

const isActiveSchoolExistsValidator = async (value) => {
  const School = require("@MEModels/schoolModel");
  const schoolExists = await School.findById(value);
  return !!(schoolExists && schoolExists.is_active);
};

const isActiveEducationBoardExistsValidator = async (value) => {
  const EducationBoard = require("@MEModels/educationBoardModel");
  const educationBoardExists = await EducationBoard.findById(value);
  return !!(educationBoardExists && educationBoardExists.is_active);
};

const isActiveSchoolTypeExistsValidator = async (value) => {
  const SchoolType = require("@MEModels/schoolTypeModel");
  const schoolTypeExists = await SchoolType.findById(value);
  return !!(schoolTypeExists && schoolTypeExists.is_active);
};

const isActiveAcademicClassExistsValidator = async (value) => {
  const academicClass = require("@MEModels/academicClassModel");
  const academicClassExists = await academicClass.findById(value);
  return !!(academicClassExists && academicClassExists.is_active);
};

module.exports = {
  isActiveUserValidator,
  isActiveCityExistsValidator,
  isActiveStateExistsValidator,
  isActiveSchoolExistsValidator,
  isActiveZipcodeExistsValidator,
  isActiveDistrictExistsValidator,
  isActiveAreaNameExistsValidator,
  isActiveSchoolTypeExistsValidator,
  isActiveFacilityTypeExistsValidator,
  isActiveOrganizationExistsValidator,
  isActiveAcademicClassExistsValidator,
  isActiveEducationBoardExistsValidator,
};
