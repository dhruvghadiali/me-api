const mongoose = require("mongoose");

const City = require("@MEModels/cityModel");
const State = require("@MEModels/stateModel");
const FeeType = require("@MEModels/feeTypeModel");
const Zipcode = require("@MEModels/zipcodeModel");
const District = require("@MEModels/districtModel");
const AreaName = require("@MEModels/areaNameModel");
const Facility = require("@MEModels/facilityModel");
const FacilityType = require("@MEModels/facilityTypeModel");
const AcademicGrade = require("@MEModels/academicGradeModel");
const EducationBoard = require("@MEModels/educationBoardModel");
const AdmissionDocument = require("@MEModels/admissionDocument");

// const SchoolType = require("@MEModels/schoolTypeModel");
// const EducationBoard = require("@MEModels/educationBoardModel");

const {
  feeTypeNotFound,
  zipcodeNotFound,
  cityNameNotFound,
  areaNameNotFound,
  stateNameNotFound,
  facilityNameNotFound,
  facilityTypeNotFound,
  districtNameNotFound,
  academicGradeNotFound,
  educationBoardNotFound,
  admissionDocumentNotFound,
} = require("@MEHelpers/validationMessage");

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

const isActiveAcademicGradeExists = async (value) => {
  const response = await AcademicGrade.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error(academicGradeNotFound);
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

// exports.isDistrictExists = async (value, helpers) => {
//   const response = await District.exists({
//     _id: value,
//     is_active: true,
//     state: helpers?.state?.ancestors?.[0].state,
//   });
//   if (!response) {
//     throw new Error(validationMessage.districtNameNotFound);
//   }
//   return value;
// };

// exports.isCityExists = async (value, helpers) => {
//   const response = await City.exists({
//     _id: value,
//     is_active: true,
//     district: helpers?.state?.ancestors?.[0].district,
//   });
//   if (!response) {
//     throw new Error(validationMessage.cityNameNotFound);
//   }
//   return value;
// };

// exports.isAreaNameExists = async (value, helpers) => {
//   const response = await AreaName.exists({
//     _id: value,
//     is_active: true,
//     city: helpers?.state?.ancestors?.[0].city,
//   });
//   if (!response) {
//     throw new Error(validationMessage.areaNameNotFound);
//   }
//   return value;
// };

// exports.isZipcodeExists = async (value, helpers) => {
//   const response = await Zipcode.exists({
//     _id: value,
//     is_active: true,
//     area_name: helpers?.state?.ancestors?.[0].area_name,
//   });
//   if (!response) {
//     throw new Error(validationMessage.zipcodeNotFound);
//   }
//   return value;
// };

// exports.isSchoolTypeExists = async (value, helpers) => {
//   const response = await SchoolType.exists({
//     _id: value,
//     is_active: true,
//   });
//   if (!response) {
//     throw new Error(validationMessage.schoolTypeNotFound);
//   }
//   return value;
// };

// exports.isEducationBoardsExists = async (value) => {
//   const existingEducationBoards = await EducationBoard.find({
//     _id: { $in: value },
//     is_active: true,
//   }).select("_id");

//   const foundIds = existingEducationBoards.map((educationBoard) =>
//     String(educationBoard._id)
//   );
//   const missingIds = value.filter((id) => !foundIds.includes(id));

//   if (missingIds.length > 0) {
//     throw new Error(validationMessage.educationBoardNotFound);
//   }
// };

module.exports = {
  isActiveCityExists,
  checkValidObjectId,
  isActiveStateExists,
  isActiveFeeTypeExists,
  isActiveZipcodeExists,
  isActiveDistrictExists,
  isActiveAreaNameExists,
  isActiveFacilityExists,
  isActiveFacilityTypeExists,
  isActiveAcademicGradeExists,
  isActiveEducationBoardExists,
  isActiveAdmissionDocumentExists,
};
