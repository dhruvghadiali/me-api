const {
  getStudentProfileInfo,
} = require("@MEControllers/studentProfileController/getStudentProfileController");
const {
  addStudentProfile,
} = require("@MEControllers/studentProfileController/addStudentProfileController");

module.exports = { addStudentProfile, getStudentProfileInfo };
