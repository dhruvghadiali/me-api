// Import controller methods from separate files
const {
  addAdmissionApplication,
} = require("@MEControllers/admissionApplicationController/addAdmissionApplication");
const {
  updateAdmissionApplicationStatus,
} = require("@MEControllers/admissionApplicationController/updateAdmissionApplicationStatus");
const {
  documentVerificationAppointmentBooking,
} = require("@MEControllers/admissionApplicationController/documentVerificationAppointmentBooking");

const {
  updateDocumentVerification,
} = require("@MEControllers/admissionApplicationController/updateDocumentVerification");
const {
  addDocumentVerificationAppointment,
} = require("@MEControllers/admissionApplicationController/addDocumentVerificationAppointment");
const {
  bookFeePaymentAppointment,
} = require("@MEControllers/admissionApplicationController/bookFeePaymentAppointment");
const {
  addPaymentMethod,
} = require("@MEControllers/admissionApplicationController/addPaymentMethod");
const {
  addFeePaymentAppointment,
} = require("@MEControllers/admissionApplicationController/addFeePaymentAppointment");

// Re-export all controller methods
module.exports = {
  addAdmissionApplication,
  updateAdmissionApplicationStatus,
  documentVerificationAppointmentBooking,
  updateDocumentVerification,
  addDocumentVerificationAppointment,
  bookFeePaymentAppointment,
  addPaymentMethod,
  addFeePaymentAppointment,
};
