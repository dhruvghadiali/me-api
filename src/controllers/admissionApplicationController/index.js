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
  rescheduleDocumentVerificationAppointment,
} = require("@ME/controllers/admissionApplicationController/rescheduleDocumentVerificationAppointment");
const {
  updateVerifiedDocuments,
} = require("@ME/controllers/admissionApplicationController/updateVerifiedDocuments");

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
  updateVerifiedDocuments,
  updateAdmissionApplicationStatus,
  documentVerificationAppointmentBooking,
  rescheduleDocumentVerificationAppointment,
  bookFeePaymentAppointment,
  addPaymentMethod,
  addFeePaymentAppointment,
};
