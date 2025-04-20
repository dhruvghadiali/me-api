// const mongoose = require("mongoose");

// const City = require("@MEModels/cityModel");
// const State = require("@MEModels/stateModel");
// const Zipcode = require("@MEModels/zipcodeModel");
// const District = require("@MEModels/districtModel");
// const AreaName = require("@MEModels/areaNameModel");
// const SchoolType = require("@MEModels/schoolTypeModel");
// const EducationBoard = require("@MEModels/educationBoardModel");
// const validationMessage = require("@MEHelpers/validationMessage");

// exports.checkValidObjectId = (value, helpers) => {
//   if (!mongoose.Types.ObjectId.isValid(value)) {
//     return helpers.error("any.invalid");
//   }
//   return value;
// };

// exports.isStateExists = async (value) => {
//   const response = await State.exists({ _id: value, is_active: true });
//   if (!response) {
//     throw new Error(validationMessage.stateNameNotFound);
//   }
//   return value;
// };

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
