const {
  getStudentProfileInfo,
} = require("@MEControllers/studentProfileController/getStudentProfileController");
const {
  addStudentProfile,
} = require("@MEControllers/studentProfileController/addStudentProfileController");
const {
  updateStudentProfile,
} = require("@MEControllers/studentProfileController/updateStudentProfileController");

module.exports = {
  addStudentProfile,
  updateStudentProfile,
  getStudentProfileInfo,
};
