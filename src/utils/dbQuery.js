const _ = require("lodash");

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

const isActiveFacilityExistsValidator = async (value) => {
  const Facility = require("@MEModels/facilityModel");
  const facilityExists = await Facility.findById(value);
  return !!(facilityExists && facilityExists.is_active);
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

const isActiveSchoolAcademicClassExistsValidator = async (value) => {
  const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
  const schoolAcademicClassExists = await SchoolAcademicClass.findById(value);
  return !!(schoolAcademicClassExists && schoolAcademicClassExists.is_active);
};

const isActiveFeeTypeExistsValidator = async (value) => {
  const FeeType = require("@MEModels/feeTypeModel");
  const feeTypeExists = await FeeType.findById(value);
  return !!(feeTypeExists && feeTypeExists.is_active);
};

const isActiveAdmissionDocumentValidator = async (value) => {
  const AdmissionDocument = require("@MEModels/admissionDocumentModel");
  const admissionDocument = await AdmissionDocument.findById(value);
  return !!(admissionDocument && admissionDocument.is_active);
};

/**
 * Validates that notes are provided when a required document is not verified
 * @param {string} notes - The notes value
 * @param {boolean} isVerified - Whether the document is verified
 * @param {string} documentId - The school_admission_document ID
 * @returns {Promise<boolean>} - True if validation passes
 */
const validateDocumentNotesRequired = async function (
  notes,
  isVerified,
  documentId
) {
  // If notes are provided, it's always valid
  if (!_.isEmpty(_.trim(notes))) {
    return true;
  }

  // If is_verified is true, notes are optional
  if (isVerified === true) {
    return true;
  }

  // If is_verified is false, check if the document is required
  if (isVerified === false && documentId) {
    const SchoolAdmissionDocument = require("@MEModels/schoolAdmissionDocumentModel");
    const doc = await SchoolAdmissionDocument.findById(documentId);

    // If document is required and is_verified is false, notes are required
    if (doc && doc.is_required === true) {
      return false; // Notes are required but not provided
    }
  }

  return true; // Notes are optional for non-required documents
};

module.exports = {
  isActiveUserValidator,
  isActiveCityExistsValidator,
  isActiveStateExistsValidator,
  isActiveSchoolExistsValidator,
  validateDocumentNotesRequired,
  isActiveFeeTypeExistsValidator,
  isActiveZipcodeExistsValidator,
  isActiveDistrictExistsValidator,
  isActiveAreaNameExistsValidator,
  isActiveFacilityExistsValidator,
  isActiveSchoolTypeExistsValidator,
  isActiveAdmissionDocumentValidator,
  isActiveFacilityTypeExistsValidator,
  isActiveOrganizationExistsValidator,
  isActiveAcademicClassExistsValidator,
  isActiveEducationBoardExistsValidator,
  isActiveSchoolAcademicClassExistsValidator,
};
