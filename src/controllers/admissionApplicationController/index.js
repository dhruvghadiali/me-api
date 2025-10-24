// Import controller methods from separate files
const {
  addAdmissionApplication,
} = require("@MEControllers/admissionApplicationController/addAdmissionApplication");
const {
  updateAdmissionApplicationStatus,
} = require("@MEControllers/admissionApplicationController/updateAdmissionApplicationStatus");

// Re-export all controller methods
module.exports = {
  addAdmissionApplication,
  updateAdmissionApplicationStatus,
};
