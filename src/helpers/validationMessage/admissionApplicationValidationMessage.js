const admissionApplicationValidationMessage = {
  admissionApplicationAcademicSessionRequired: "Academic session is required",
  admissionApplicationAcademicSessionInvalid: `Academic session must be in the format "YYYY-YYYY" with consecutive years (e.g., "2025-2026")`,
  admissionApplicationApplicationNumberRequired: `Application number is required`,
  admissionApplicationApplicationNumberEmpty: `Application number cannot be empty`,
  admissionApplicationDocumentVerificationNotesRequired: `Notes are required when a required document is not verified`,
  admissionApplicationDocumentVerificationScheduleDateRequired: `Document verification appointment scheduled date is required`,
  admissionApplicationDocumentVerificationScheduleTimeSlotRequired: `Document verification appointment scheduled time slot is required`,
  admissionApplicationDocumentVerificationScheduleTimeSlotInvalid: `Invalid time slot format. Use 12-hour format 'HH:MM AM/PM - HH:MM AM/PM' (e.g., '10:00 AM - 11:00 AM') with end time after start time`,
  admissionApplicationDocumentVerificationSchedulerRequired: `Document verification appointment booked by user id is required`,
  admissionApplicationFeePaymentDateRequired: `Fee payment appointment scheduled date is required`,
  admissionApplicationFeePaymentTimeSlotRequired: `Fee payment appointment scheduled time slot is required`,
  admissionApplicationFeePaymentTimeSlotInvalid: `Invalid time slot format. Use 12-hour format 'HH:MM AM/PM - HH:MM AM/PM' (e.g., '10:00 AM - 11:00 AM') with end time after start time`,
  admissionApplicationFeePaymentSchedulerRequired: `Fee payment appointment booked by is required`,
};

module.exports = admissionApplicationValidationMessage;
