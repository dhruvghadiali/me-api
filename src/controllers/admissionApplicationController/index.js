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
} = require("@MEControllers/admissionApplicationController/rescheduleDocumentVerificationAppointment");
const {
  updateVerifiedDocuments,
} = require("@MEControllers/admissionApplicationController/updateVerifiedDocuments");
const {
  feePaymentAppointmentBooking,
} = require("@MEControllers/admissionApplicationController/feePaymentAppointmentBooking");

const {
  addPaymentMethod,
} = require("@MEControllers/admissionApplicationController/addPaymentMethod");
const {
  addFeePaymentAppointment,
} = require("@MEControllers/admissionApplicationController/addFeePaymentAppointment");

const {
  getAdmissionApplications,
} = require("@MEControllers/admissionApplicationController/getAdmissionApplications");

// Re-export all controller methods
module.exports = {
  addAdmissionApplication,
  updateVerifiedDocuments,
  updateAdmissionApplicationStatus,
  documentVerificationAppointmentBooking,
  rescheduleDocumentVerificationAppointment,
  feePaymentAppointmentBooking,
  addPaymentMethod,
  addFeePaymentAppointment,
  getAdmissionApplications,
};
